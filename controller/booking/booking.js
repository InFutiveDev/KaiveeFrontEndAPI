const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const bookingModel = require("../../models/booking");
const couponModel = require("../../models/coupon");
const testModel = require("../../models/test");
const userModel = require("../../models/user");
const labModel = require("../../models/lab");

const familyModel = require("../../models/familyMember");
const mongoose = require("mongoose");
const { sendMsg } = require("../../utility/OTP");
const { sendEmail } = require("../../utility/mail");
const addressModel = require("../../models/address");
const {
  generatePaymentLink,
  checkOrderStatus,
} = require("../../controller/payment-gateway/hdfc/hdfc");
const {
  generatePayment,
  checkOrderStatusRazorpay,
} = require("../../controller/payment-gateway/razorpay/razorpay");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addBooking = async (req, res) => {
  const { logger } = req;

  try {
    const { userId } = req.decoded;
    const {
      address,
      sampleCollectionDateTime,
      testId,
      paymentAmount,
      lab_id,
      collectionType,
      couponId,
      memberId,
      paymentType,
      timeslot,
    } = req.body;

    var testDetails = [];
    // console.log(testId);
    // console.log(testId);
    console.log("Received couponId:", couponId); 
    const qry = {};
    if (couponId) {
      qry["$or"] = [{ coupon_code: { $regex: couponId, $options: "i" } }];
    }
    const GetcouponId = await couponModel.aggregate([
      {
        $match: qry,
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    if (GetcouponId.length == 0) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.INVALID_COUPON,
      };
      return Response.error(obj);
    }
    // console.log("GetcouponId--->", GetcouponId[0]._id);
    console.log("userId--->", userId);
    let totalDbAmount = 0;

    for (let i = 0; i < testId.length; i++) {
      //console.log("DoneLoop");
      const testData = await testModel.aggregate([
        {
          $match: { _id: ObjectId(testId[i]) },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);
      testData.map((e) => {
        totalDbAmount += e.offer_price;
        testDetails.push(e);
      });
    }

   
    const user = await userModel.findOne({ _id: userId });
    const username = user.name;
    const useremail = user.email.id;
    const mobileuser = user.email.mobile;

    const addressData = await addressModel.findOne({
      _id: mongoose.Types.ObjectId(address),
    });
    const addressename = addressData.address1;
    const locality = addressData.near_by_locality;
    const city1 = addressData.city;
    const state1 = addressData.state;
    const pin = addressData.postCode;

    // const labData = await labModel.findOne({
    //   _id: mongoose.Types.ObjectId(lab_id),
    // });
    // const lab_name = labData.branch_Name ? labData.branch_Name : null;

    const memberData = await familyModel.findOne({
      _id: mongoose.Types.ObjectId(memberId),
    });
    const membername = memberData.fullName;
    const relation = memberData.relation;
    const gender = memberData.gender;
    const age = memberData.age;

    // const labData = await labModel.findOne({_id:mongoose.Types.ObjectId(lab_id)});
    // const labName = labData.branch_Name;
    // const labAddress = labData.branch_address;

    const saveBooking = await bookingModel.create({
      memberId,
      userId,
      address,
      sampleCollectionDateTime,
      testId: testDetails,
      lab_id: lab_id || null,
      paymentAmount,
      couponId: GetcouponId[0]._id,
      collectionType,
      timeslot,
      paymentType,
    });

    const orderId = saveBooking.id;
    const bookingtime = saveBooking.createdAt;

    // let smsPayload = {
    //   message: `Dear ${username}, we have received your test request for Order ID: ${orderId}. Our Team will contact you shortly. Amount payable is Rs. ${paymentAmount}. Thank you for choosing City X-Ray & Scan Clinic`,
    //   mobile: mobileuser,
    // };
    // sendMsg(smsPayload);

  //   const htmlTemplate = `<!DOCTYPE html>
  //  <html>
  //     <head>
  //        <meta http-equiv="content-type" content="text/html; charset=windows-1252">
  //     </head>
  //     <style>
  //        p {
  //        margin: 11px;
  //        }
  //        h4 {
  //        font-size: 18px;
  //        margin: 10px 0px;
  //        }
  //     </style>
  //     <body>
  //        <table style="border:10px solid #DD861F;" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="650">
  //           <tbody>
  //              <tr>
  //                 <td align="left" valign="top"><table style="border-bottom:1px solid #cccccc; border="0" cellpadding="0" cellspacing="0" width="650">
  //           <tbody>
  //              <tr>
  //                 <td style="padding: 0px 20px;background-color: #fcc42c;" align="left" valign="middle" width="275">
  //                    <h2>Booking ID : ${orderId}</h2>
  //                 </td>
  //              </tr>
  //           </tbody>
  //        </table>
  //        </td>
  //        </tr>
  //        <tr>
  //           <td align="left" valign="top">
  //              <table border="0" cellpadding="0" cellspacing="0" width="650">
  //                 <tbody>
  //                    <tr>
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //                    <tr>
                        
  //                       <td colspan="3" style="font-size:13px;color:#333333" width="590">
  //                      <tr>
  //                         <td width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Customer Name(s)</h4>
  //                            <p>${membername} (${age}/${gender})</p>
  //                         </td>
  //                         <td colspan="2" width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Phone</h4>
  //                            <p>${mobileuser}</p>
  //                         </td>
  //                      </tr>

  //                      <tr>
  //                      <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                   </tr>
  //                   <tr>
                       
  //                      <td colspan="3" style="font-size:13px;color:#333333" width="590">
  //                     <tr>
  //                        <td width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                           <h4>Order date</h4>
  //                           <p>${bookingtime}</p>
  //                        </td>
  //                        <td colspan="2" width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                           <h4>Patient Address</h4>
  //                           <p>${
  //                             addressename +
  //                             "," +
  //                             locality +
  //                             "," +
  //                             city1 +
  //                             "," +
  //                             state1 +
  //                             "," +
  //                             pin
  //                           }</p>
  //                        </td>
  //                     </tr>

  //                      <tr>
  //                         <td width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Lab Name</h4>
  //                            <p>City X-Ray</p>
  //                         </td>
  //                         <td colspan="2" width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Payment Status</h4>
  //                            <p>${saveBooking.is_paid}</p>
  //                         </td>
  //                      </tr>
  //                      </td>
                       
  //                    </tr>

                     

  //                    <tr>
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //                    <tr>
  //           <td height="30" width="33%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;"><b>Test Name</b> </td>
  //           <td height="30" width="20%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;"><b>Date Of Visit</b></td>
  //           <td height="30" width="20%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;"><b>Time Slot</b></td>
                    
  //                    </tr>

                     
   
  //                    <tr>
  //           <td height="30" width="33%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;">${testDetails.map(
  //             (test, index) => ` ${index + 1}: ${test.test_name}\n`
  //           )}</td>
  //           <td height="30" width="20%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;">${sampleCollectionDateTime}</td>
  //           <td height="30" width="20%" style="padding: 0px 10px;background-color: #fcc42c;border: solid #fff;">${timeslot}</td>   
                   
  //                    </tr>

  //                    <tr>
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //  <tr>
  //                       <td colspan="3" style="padding: 10px; background-color: #fcc42c; border: solid #fff; text-align: center;">
  //                          <h4>Collection Type</h4>
  //                          <p>${collectionType}</p>
  //                       </td>
  //                    </tr>
   
   
  //        <tr>
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //                    <tr >
                        
  //                       <td colspan="3" style="font-size:13px;color:#333333" width="590">
  //                      <tr style="text-align: center;">
  //                         <td width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Payment Status</h4>
  //                            <p>${paymentType}</p>
  //                         </td>
  //                         <td colspan="2" width="50%" style="padding: 0px 10px;background-color: #fcc42c;     border: solid #fff;">
  //                            <h4>Amount to be Collected</h4>
  //                            <p>${paymentAmount}</p>
  //                         </td>
  //                      </tr>
  //                      </td>
  //                    </tr>
  //        <tr>
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //                    <tr style="text-align: center;">
  //                       <td colspan="3" height="20" width="100%"><span height="1" width="1">
  //                       <b>Important : </b> Once the test reports are generated, Please send to Cityxrayclinic.com</td>
  //                    </tr>
                     
  //                    <tr>
  //                       <td colspan="3" height="30" width="100%"><span height="1" width="1"></td>
  //                    </tr>
  //                 </tbody>
  //              </table>
  //           </td>
  //        </tr>
  //        </tbody></table>
  //     </body>
  //  </html>
  //  `;

  //   sendEmail({
  //     subject: `Kaivee (Order Booking) Booking ID: ${orderId}`,
  //     html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
  //     to: "infutivedevloper@2gmail.com",
      
  //     from: "vik18nov@gmail.com",
  //   });
  if (saveBooking.paymentType === "online") {
    let paymentBody = {
      order_id: saveBooking.id.toString(),
      amount: saveBooking.paymentAmount.toString(),
      customer_id: saveBooking.userId.toString(),
      customer_email: user.email.id || "infutivedeveloper@gmail.com",
      customer_phone: memberData.phone.toString(),
      return_url: "https://kaiveehealthcare.com/booking-success",
      description: "Complete your payment",
      first_name: memberData.fullName.toString(),
      last_name: "",
    };

    try {
      let paymentLinks = await generatePayment(paymentBody);
      paymentLinks.order_id = saveBooking.id;

      return Response.success({
        res,
        status: Constant.STATUS_CODE.OK,
        msg: "Payment Link Created successfully",
        data: paymentLinks,
      });
    } catch (err) {
      console.error("Razorpay Payment Link Error:", err);
      return Response.error({
        res,
        status: Constant.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: "Failed to generate payment link",
      });
    }
  } else {
    return Response.success({
      res,
      msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY + " payment pending",
      status: Constant.STATUS_CODE.OK,
      data: saveBooking,
    });
  }
} catch (error) {
  console.error("Booking Error:", error);
  return handleException(logger, res, error);
}
};

const checkOrderStatusByOrderIDRazorpay = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    const payment_id = req.query.payment_id;
    const payment_link_id = req.query.payment_link_id;

    let payload = {
      payment_id: payment_id,
      payment_link_id: payment_link_id,
    };

    const orderStatus = await checkOrderStatusRazorpay(payload);
    // console.log('orderStatus',orderStatus);
    if (orderStatus.status == "captured") {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: "Order Status",
        data: orderStatus,
      };
      return Response.success(obj);
    } else {
      // console.log('orderStatus',orderStatus);
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: "Payment Not Process...",
        data: orderStatus,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const checkOrderStatusByOrderID = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    const order_id = req.query.order_id;
    let payload = { order_id: order_id };
    console.log("payload", payload);

    const orderStatus = await checkOrderStatus(payload);
    if (orderStatus.msg !== "Payment Not Done") {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: "Order Status",
        data: orderStatus,
      };
      return Response.success(obj);
    } else {
      // console.log('orderStatus',orderStatus);
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: "Payment Not Process...",
        data: orderStatus,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getBookingById = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;

    let { collection, str, page, limit } = req.query;
    if (_.isUndefined(str)) str = "";
    if (collection === "newest") {
      sampleCollectionDateTime = { createdAt: -1 };
    } else {
      sampleCollectionDateTime = { createdAt: 1 };
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    // console.log("abc")
    const bookingData = await bookingModel.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
      },
      {
        $sort: sampleCollectionDateTime,
      },
      // {
      //   $lookup: {
      //     from: "tests",
      //     localField: "testId._id",
      //     foreignField: "_id",
      //     as: "testData",
      //   },
      // },
      // {
      //   $unwind: { path: "$testData", preserveNullAndEmptyArrays: true },
      // },
      {
        $lookup: {
          from: "familymembers",
          localField: "memberId",
          foreignField: "_id",
          as: "memberData",
        },
      },
      {
        $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "labs",
          localField: "lab_id",
          foreignField: "_id",
          as: "labData",
        },
      },
      {
        $unwind: { path: "$labData", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          userId: 1,
          address: 1,
          sampleCollectionDateTime: 1,
          testData: "$testId",
          memberData: "$memberData",
          labData: "$labData",
          paymentAmount: 1,
          id: 1,
          is_paid: 1,
          collectionType: 1,
          createdAt: 1,
          paymentType: 1,
        },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    //console.log(bookingData);

    // console.log("abc2",bookingData)

    if (_.isEmpty(bookingData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          data: [],
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: 0,
          },
        },
      };
      return Response.success(obj);
    }
    obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESS,
      status: Constant.STATUS_CODE.OK,
      data: {
        data: bookingData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: bookingData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const bookingPayment = async (req, res) => {
  const { logger } = req;

  try {
    const { userId } = req.decoded;

    const orderdetails = await bookingModel.aggregate([
      {
        $match: {
          $and: [
            { userId: mongoose.Types.ObjectId(userId) },
            { paymentType: "pay-cash" || "pay-now" },
            { is_paid: false },
            // {collectionType:"Home Collection"||"Lab Collection"}
          ],
        },
      },
      {
        $project: {
          userId: 1,
          sampleCollectionDateTime: 1,
          paymentAmount: 1,
          paymentType: 1,
          is_paid: 1,
          testId: 1,
          collectionType: 1,
        },
      },
    ]);
    if (orderdetails.paymentType === "pay-now") {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR + " : use other payment method",
      };
      return Response.success(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY + "  payment pending",
        status: Constant.STATUS_CODE.OK,
        data: orderdetails,
      };
      return Response.error(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addBooking,
  getBookingById,
  bookingPayment,
  checkOrderStatusByOrderID,
  checkOrderStatusByOrderIDRazorpay,
};
