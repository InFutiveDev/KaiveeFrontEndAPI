const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const reasearchModel = require("../../models/reasearch");
const reasearchFormModel = require("../../models/reasearchform");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const _ = require("underscore");
const { sendEmail } = require("../../utility/mail");

const addreasearch = async (req, res) => {
  const { logger } = req;
  // console.log(req);
  try {
    const reasearch = req.files.reasearchfile.filepath;

    // firebase logic to upload the image
    let uploaded = bucket.upload(reasearch, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.reasearchfile.filepath
      }`,

      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;
    const savereasearch = await reasearchModel.create({
      reasearchname: req.data.reasearchname,
      reasearchfile: mediaLink,
    });
    if (!savereasearch) {
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
        data: savereasearch,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllreasearch = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [{ reasearchname: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const reasearchData = await reasearchModel.aggregate([
      {
        $match: qry,
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(reasearchData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          items: [],
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
        reasearchData: reasearchData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: reasearchData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getReasearchById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const reasearchData = await reasearchModel.findOne({ _id: _id });
    if (!reasearchData) {
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
        data: reasearchData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// form submittion

const addReasearchform = async (req, res) => {
  const { logger } = req;
  try {
    const { your_name, email, mobile_number, write_up } = req.body;
    const reaserchData = await reasearchFormModel.create({
      your_name,
      email,
      mobile_number,
      write_up,
    });
//     const htmlTemplate = `
//        <!DOCTYPE html>
// <html>
//   <head>
//     <meta http-equiv="content-type" content="text/html; charset=windows-1252" />
//     <style>
//       /* Styling for email */
//       body {
//         font-family: Arial, sans-serif;
//         font-size: 13px;
//         color: #333333;
//         margin: 0;
//         padding: 0;
//       }
//       a {
//         color: #DD861F;
//         text-decoration: none;
//       }
//       img {
//         display: block;
//         width: 100px;
//         height: auto;
//       }
//       table {
//         border-spacing: 0;
//         border-collapse: collapse;
//       }
//     </style>
//   </head>
//   <body>
//     <table
//       style="border: 10px solid #DD861F; width: 650px; margin: 0 auto;"
//       bgcolor="#ffffff"
//       cellpadding="0"
//       cellspacing="0"
//     >
//       <tbody>
//         <!-- Header Section -->
//         <tr>
//           <td>
//             <table style="border-bottom: 1px solid #cccccc; width: 100%;" cellpadding="10" cellspacing="0">
//               <tbody>
//                 <tr>
//                   <td style="background-color: #fcc42c;" align="left">
//                     <img
//                     src="https://www.cityxrayclinic.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FappLogo.e921700e.png&w=750&q=100"
//                     alt="City X-Ray Clinic"
//                       width="100px"
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
//           <td>
//             <table style="width: 100%;" cellpadding="0" cellspacing="0">
//               <tbody>
//                 <tr>
//                   <td style="padding: 20px;">
//                     <p style="font-size: 18px; color: #DD861F; font-weight: bold;">
//                       Thanks for Submitting Your Enquiry With Us.
//                     </p>
//                     <p>We will get back to you soon.</p>
//                     <p><b>Name:</b> ${your_name}</p>
//                     <p><b>Email:</b> ${email}</p>
//                     <p><b>Phone Number:</b> ${mobile_number}</p>
//                     <p><b>Message:</b> ${write_up}</p>
//                     <p>
//                       For any enquiry, call us on
//                       <a href="tel:011-4725-2000">+91-011-4725-2000</a>
//                     </p>
//                     <p><b>Thank you,</b></p>
//                     <p><b>City X-Ray & Scan Clinic Pvt Ltd</b></p>
//                   </td>
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
//       subject: `CXR Enquiry(Clinical Research & Trials)-${mobile_number}`,
//       html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
//       to: [
//         "draakaar@cityxrayclinic.com",
//         "rnd@cityimaging.in",
//         "rnd@cityxrayclinic.com",
//       ],
//       from: process.env.EMAIL,
//     });
    if (!reaserchData) {
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
        data: reaserchData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addreasearch,
  getAllreasearch,
  getReasearchById,
  addReasearchform,
};
