const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const appointmentModel = require("../../models/appointment");
const userModel = require("../../models/user");
const memberModel = require("../../models/familyMember");
const labModel = require("../../models/lab");
const addressModel = require("../../models/address");
const mongoose = require("mongoose");
const { sendMsg } = require("../../utility/OTP");
const { sendEmail } = require("../../utility/mail");
const _ = require("underscore");

const addappointment = async (req, res) => {
  const { logger } = req;

  try {
    const { userId } = req.decoded;

    const {
      memberId,
      address,
      nearest_centre,
      appointment_date,
      time,
      message_box,
    } = req.body;

    let userData = await userModel.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    let mobile = userData.email.mobile;
    let username = userData.name;

    // let memberData = await memberModel.findOne({_id:mongoose.Types.ObjectId(memberId)});
    // let memberName = memberData.relation;

    let addressData = await addressModel.findOne({
      _id: mongoose.Types.ObjectId(address),
    });
    let addressdetail = addressData.address1;

    let memberData = await memberModel.findOne({
      _id: mongoose.Types.ObjectId(memberId),
    });
    let memberdetail = memberData.fullName;

    let labData = await labModel.findOne({
      _id: mongoose.Types.ObjectId(nearest_centre),
    });
    let labdetail = labData.branch_Name;
    const savemember = await appointmentModel.create({
      userId,
      memberId,
      address,
      nearest_centre,
      appointment_date,
      time,
      user_mobile: mobile,
      message_box,
    });

    let smsPayload = {
      message: `Thank you for booking an Appointment with us. Your Appointment ID is: ${savemember.appointmentId}. Our Team will contact you soon to confirm your appointment for ${appointment_date}. City X-Ray and Scan Clinic`,
      mobile: mobile,
    };
    sendMsg(smsPayload);

    const htmlTemplate = `
    <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=windows-1252">
    <style>
      /* General Reset */
      img {
        display: block;
        border: 0;
        outline: none;
        text-decoration: none;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      p {
        margin: 0;
        padding: 0;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <table style="border: 10px solid #DD861F;" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="650">
      <tbody>
        <!-- Header Section -->
        <tr>
          <td align="left" valign="top">
            <table style="border-bottom: 1px solid #cccccc;" border="0" cellpadding="0" cellspacing="0" width="650">
              <tbody>
                <tr>
                  <td style="padding: 10px; background-color: #fcc42c;" align="left" valign="middle" width="275">
                    <img
                      alt="CityImaging"
                      src="https://www.cityxrayclinic.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FappLogo.e921700e.png&w=750&q=100"
                      width="100"
                      height="100"
                      style="width: 100px; height: 40px; max-width: 100px; max-height: 100px;"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Body Section -->
        <tr>
          <td align="left" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" width="650">
              <tbody>
                <tr>
                  <td colspan="3" height="30" width="100%">&nbsp;</td>
                </tr>
                <tr>
                  <td width="30">&nbsp;</td>
                  <td style="font-size: 13px; color: #333333; font-family: Arial, sans-serif;" width="590">
                    <p style="font-size: 18px; color: #DD861F; margin-bottom: 0.5em;">&nbsp;</p>
                    <p>&nbsp;</p>
                    <p style="font-size: 13px; font-weight: bold;">
                      Thanks for submitting your appointment with us. We will get back to you soon.
                    </p>
                    <p><b>User ID:</b> ${
                      username + "Member name :" + memberdetail
                    }</p>
                    <p>Address: ${addressdetail}</p>
                    <p>Nearest Centre: ${labdetail}</p>
                    <p>Appointment Date: ${appointment_date}</p>
                    <p>Time: ${time}</p>
                    <p>Message: ${message_box}</p>
                    <p>
                      For any enquiry, call us on
                      <a href="tel:011-4725-2000" style="color: #DD861F; text-decoration: none;">+91-011-4725-2000</a>
                    </p>
                    <div><b>Thank you,</b></div>
                    <div><b>City X-Ray & Scan Clinic Pvt Ltd</b></div>
                  </td>
                  <td width="30">&nbsp;</td>
                </tr>
                <tr>
                  <td colspan="3" height="30" width="100%">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
    `;

    sendEmail({
      subject: `CXR(Appointment)-${mobile}`,
      html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
      to: process.env.TOMAIL,
      from: process.env.EMAIL,
      cc: process.env.CC,
    });
    if (!savemember) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: savemember,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getById = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    const appointmentData = await appointmentModel.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
      },
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
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "addressData",
        },
      },
      {
        $unwind: { path: "$addressData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "labs",
          localField: "nearest_centre",
          foreignField: "_id",
          as: "centreData",
        },
      },
      {
        $unwind: { path: "$centreData", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (!appointmentData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: appointmentData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addappointment,
  getById,
};
