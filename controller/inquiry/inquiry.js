const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const inquiryModel = require("../../models/inquiry");
const testModel = require("../../models/test");
const userModel = require("../../models/user");
const _ = require("underscore");
const mongoose = require("mongoose");
const { sendMsg } = require("../../utility/OTP");
const { sendEmail } = require("../../utility/mail");
const { ObjectId } = mongoose.Types;
const axios = require("axios");

const addInquiry = async (req, res) => {
  const { logger } = req;

  try {
    // const { userId } = req.decoded;
    const {
      patient_name,
      patient_email,
      message,
      mobile_number,
      inquiry_from,
      url,
      testfield,
      //otp,
    } = req.body;

    var OtpCode = Math.floor(100000 + Math.random() * 900000);

    // const user = await userModel.findOne({ _id: userId });
    // const mobilesms = user.email.mobile;

    const saveInquiry = await inquiryModel.create({
      patient_name,
      patient_email,
      message,
      mobile_number,
      inquiry_from,
      url,
      testfield,
      otp: OtpCode,
    });

    const inquiryTime = saveInquiry.createdAt;

//     let data = JSON.stringify({
//       project_id: "f9a33498758ee3fa30c6",
//       to: process.env.TOMAIL,
//       cc: "infutivedeveloper@gmail.com",
//       from: process.env.EMAIL,
//       subject: "Website",
//       body: message,
//       user_company_id: "3",
//       user_first_name: patient_name,
//       user_last_name: patient_name,
//       user_email: patient_email,
//       user_phone: mobile_number,
//       user_alt_phone: mobile_number,
//       user_address: "Delhi",
//       user_state: "Delhi",
//       user_city: "Delhi",
//       user_pincode: "110018",
//       data_source: "city Xray",
//     });

//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: "http://crm.cityxrayclinic.com/citycrm/Api/insertlead",
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: "ci_session=9ismm91de9ohchmd9p3g8eio30r12hcs",
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     let smsPayload = {
//       message: `Thank you for submitting an enquiry through our website. Our team will review your details and get back to you shortly. For urgent queries, please contact us at 01147252000 or What's app us at 9577727772 . City X-Ray & Scan Clinic.`,
//       mobile: mobilesms,
//     };
//     sendMsg(smsPayload);

//     const htmlTemplate = `
//         <!DOCTYPE html>
// <html>
//   <head>
//     <meta http-equiv="content-type" content="text/html; charset=windows-1252">
//     <style>
//       /* General Reset */
//       img {
//         display: block;
//         border: 0;
//         outline: none;
//         text-decoration: none;
//       }
//       table {
//         border-spacing: 0;
//         border-collapse: collapse;
//       }
//     </style>
//   </head>
//   <body>
//     <table style="border: 10px solid #DD861F;" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="650">
//       <tbody>
//         <tr>
//           <td align="left" valign="top">
//             <table style="border-bottom: 1px solid #cccccc;" border="0" cellpadding="0" cellspacing="0" width="650">
//               <tbody>
//                 <tr>
//                   <td style="padding: 10px; background-color: #fcc42c;" align="left" valign="middle" width="275">
//                     <img
//                       alt="CityX-rayClinic"
//                       src="https://www.cityxrayclinic.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FappLogo.e921700e.png&w=750&q=100"
//                       width="100"
//                       height="100"
//                       style="width: 100px; height: 40px; max-width: 100px; max-height: 100px;"
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </td>
//         </tr>
//         <tr>
//           <td align="left" valign="top">
//             <table border="0" cellpadding="0" cellspacing="0" width="650">
//               <tbody>
//                 <tr>
//                   <td colspan="3" height="30" width="100%">&nbsp;</td>
//                 </tr>
//                 <tr>
//                   <td width="30">&nbsp;</td>
//                   <td style="font-size: 13px; color: #333333;" width="590">
//                     <p style="font-family: Arial; font-size: 18px; color: #DD861F; margin-bottom: 0.5em; margin-top: 0;"></p>
//                     <p>&nbsp;</p>
//                     <p style="font-size: 13px; font-weight: bold;">
//                       Thanks for Submitting your Enquiry with us. We will get back to you soon.
//                     </p>
//                     <p>Patient Name: ${patient_name}</p>
//                     <p>Patient Email: ${patient_email}</p>
//                     <p>Mobile Number: ${mobile_number}</p>
//                     <p>Message: ${message}</p>
//                     <p>Enquiry From: ${inquiry_from}</p>
//                     <p>Url: ${url}</p>
//                     <p>Enquiry Time: ${inquiryTime}</p>
//                     <p>
//                       For any enquiry call us on
//                       <a href="tel:011-4725-2000" style="color: #DD861F; text-decoration: none;">+91-011-4725-2000</a>
//                     </p>
//                     <div><b>Thank you,</b></div>
//                     <div><b>City X-Ray & Scan Clinic Pvt Ltd</b></div>
//                   </td>
//                   <td width="30">&nbsp;</td>
//                 </tr>
//                 <tr>
//                   <td colspan="3" height="30" width="100%">&nbsp;</td>
//                 </tr>
//               </tbody>
//             </table>
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   </body>
// </html> `;

//     sendEmail({
//       subject: `CXR(Enquiry)-${mobile_number}`,
//       html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
//       to: process.env.TOMAIL,
//       from: process.env.EMAIL,
//       cc: process.env.CC,
//     });

    if (!saveInquiry) {
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
        data: saveInquiry,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

//verify-otp

const OtpVerifyAndRegister = async (req, res) => {
  const { logger } = req;
  try {
    const { phone_number, OtpCode } = req.body;

    const verifyOTP = await inquiryModel.find({
      phone_number: phone_number,
      otp: OtpCode,
    });

    if (!verifyOTP) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.OTP_INVALID,
      };
      return Response.error(obj);
    }
    const obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESSFUL_LOGIN + "otp matched",
      status: Constant.STATUS_CODE.OK,
      // data: verifyOTP
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

//get inquiry data

const getInquiryById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const inquiryData = await inquiryModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },

      {
        $project: {
          __v: 0,
          otp: 0,
        },
      },
    ]);
    if (!inquiryData) {
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
        data: inquiryData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addInquiry,
  OtpVerifyAndRegister,
  getInquiryById,
};
