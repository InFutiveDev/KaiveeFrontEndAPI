const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");

const prescriptionModel = require("../../models/prescription");
const userModel = require("../../models/user");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { sendMsg } = require("../../utility/OTP");
const { sendEmail } = require("../../utility/mail");
const _ = require("underscore");

const addprescription = async (req, res) => {
  const { logger } = req;
  // console.log(req);
  //let uploads =[];

  try {
    const { userId } = req.decoded;

    const elements = req.files.add_prescription;
    let uploads = null;
    if (Array.isArray(req.files.add_prescription)) {
      uploads = await Promise.all(
        elements.map(async (element) => {
          try {
            let uploaded = await bucket.upload(element.filepath, {
              public: true,
              destination: `images/${
                Math.random() * 10000 + element.originalFilename
              }`,
              metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
              },
            });
            return uploaded[0].metadata.mediaLink;
          } catch (error) {
            console.error("Error uploading:", error);
            return null;
          }
        })
      );
    } else {
      uploadsaa = await bucket.upload(req.files.add_prescription.filepath, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.add_prescription.originalFilename
        }`,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      uploads = [uploadsaa[0].metadata.mediaLink];
    }
    //  console.log('uploads',uploads)
    //  return
    let userData = await userModel.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    let mobile = userData.email.mobile;
    let id = userData._id;
    let userName = userData.name;
    let email = userData.email.id;

    const saveprescription = await prescriptionModel.create({
      userid: id,
      patient_name: req.data.patient_name,
      dob: req.data.dob,
      age: req.data.age,
      gender: req.data.gender,
      add_prescription: uploads,
      user_mobile: mobile,
    });

    const uploadTime = saveprescription.createdAt;

    // let smsPayload = {
    //   message: `Thank you for sharing your prescription with us. We have registered your query/concern under Case ID: ${saveprescription.caseId}. Our Team will contact you soon. City X-Ray and Scan Clinic`,
    //   mobile,
    // };
    // sendMsg(smsPayload);

//     const htmlTemplate = `
//        <!DOCTYPE html>
// <html>
//   <head>
//     <meta http-equiv="content-type" content="text/html; charset=windows-1252">
//     <style>
//       /* Reset styles for email clients */
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
//       p {
//         margin: 0;
//         padding: 0;
//       }
//       a {
//         color: inherit;
//         text-decoration: none;
//       }
//     </style>
//   </head>
//   <body>
//     <table style="border: 10px solid #DD861F;" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="650">
//       <tbody>
//         <!-- Header Section -->
//         <tr>
//           <td align="left" valign="top">
//             <table style="border-bottom: 1px solid #cccccc;" border="0" cellpadding="0" cellspacing="0" width="650">
//               <tbody>
//                 <tr>
//                   <td style="padding: 10px; background-color: #fcc42c;" align="left" valign="middle" width="275">
//                     <img
//                       alt="City X-Ray Clinic"
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

//         <!-- Body Section -->
//         <tr>
//           <td align="left" valign="top">
//             <table border="0" cellpadding="0" cellspacing="0" width="650">
//               <tbody>
//                 <tr>
//                   <td colspan="3" height="30" width="100%">&nbsp;</td>
//                 </tr>
//                 <tr>
//                   <td width="30">&nbsp;</td>
//                   <td style="font-size: 13px; color: #333333; font-family: Arial, sans-serif;" width="590">
//                     <p style="font-size: 18px; color: #DD861F; margin-bottom: 0.5em;">&nbsp;</p>
//                     <p style="font-size: 13px; font-weight: bold;">
//                       Thanks for submitting your enquiry with us. We will get back to you soon.
//                     </p>
//                     <p><b>Name:</b> ${userName}</p>
//                     <p><b>Email:</b> ${email}</p>
//                     <p><b>Phone Number:</b> ${mobile}</p>
//                     <p><b>Prescription:</b> ${uploads}</p>
//                     <p><b>Prescription Id:</b> ${saveprescription.caseId}</p>
//                     <p><b>Feedback Time:</b> ${uploadTime}</p>
//                     <p>
//                       For any enquiry, call us on
//                       <a href="tel:011-4725-2000" style="color: #DD861F; text-decoration: none;">+91-011-4725-2000</a>
//                     </p>
//                     <p><b>Thank you,</b></p>
//                     <p><b>City X-Ray & Scan Clinic Pvt Ltd</b></p>
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
// </html>
//         `;

//     sendEmail({
//       subject: `CXR(Prescription)-${mobile}`,
//       html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
//       to: process.env.TOMAIL,
//       from: process.env.EMAIL,
//       cc: process.env.CC,
//     });
    if (!saveprescription) {
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
        data: saveprescription,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// const OtpVerifyAndRegister = async (req, res) => {
//     const { logger } = req;
//     try {
//       const type = req.query.type;
//       const {  mobile,  otp } = req.body;

//       const verifyOTP = await prescriptionModel.find({ mobile:mobile, otp:otp });

//       if (!verifyOTP) {
//         const obj = {
//           res,
//           status: Constant.STATUS_CODE.BAD_REQUEST,
//           msg: Constant.ERROR_MSGS.OTP_INVALID,
//         };
//         return Response.error(obj);
//       }
//       const obj = {
//         res,
//         msg: Constant.INFO_MSGS.SUCCESSFUL_LOGIN,
//         status: Constant.STATUS_CODE.OK,
//         data: verifyOTP
//       };
//       return Response.success(obj);
//     } catch (error) {
//       console.log("error--->", error);
//       return handleException(logger, res, error);
//     }
//   };

//getby id

const getById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const prescriptionData = await prescriptionModel.find({
      _id: mongoose.Types.ObjectId(_id),
    });
    if (!prescriptionData) {
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
        data: prescriptionData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addprescription,
  // OtpVerifyAndRegister,
  getById,
};
