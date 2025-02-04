const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const feedbackModel = require("../../models/feedback");
const feedModel = require("../../models/newfeeds");
const { sendMsg } = require("../../utility/OTP");
const { sendEmail } = require("../../utility/mail");
const mongoose = require("mongoose");
const _ = require("underscore");
const uuid = require("uuid");

const addfeedback = async (req, res) => {
  const { logger } = req;
  // console.log(req);
  try {
    const { first_name, last_name, mobile_number, email_id, message } =
      req.body;

    var caseCode = Math.floor(10000 + Math.random() * 90000);

    const savefeeds = await feedbackModel.create({
      first_name,
      last_name,
      mobile_number,
      email_id,
      message,
      caseCode: caseCode,
    });
    let smsPayload = {
      message: `Thank you for sharing your feedback with us. We have captured your feedback under Case ID: ${caseCode}. Your feedback is important to us! City X-Ray and Scan Clinic`,
      mobile: mobile_number,
    };
    sendMsg(smsPayload);

    if (!savefeeds) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: savefeeds,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const addnewfeedback = async (req, res) => {
  const { logger } = req;
  // console.log(req);
  try {
    const { first_name, last_name, mobile_number, email_id, message } =
      req.body;

    var casecode = Math.floor(10000 + Math.random() * 90000);

    const savefeeds = await feedModel.create({
      first_name,
      last_name,
      mobile_number,
      email_id,
      message,
      caseCode: casecode,
    });

    const feedbacktime = savefeeds.createdAt;
    let smsPayload = {
      message: `Thank you for sharing your feedback with us. We have captured your feedback under Case ID: ${casecode}. Your feedback is important to us! City X-Ray and Scan Clinic`,
      mobile: mobile_number,
    };
    sendMsg(smsPayload);

    const htmlTemplate = `
       <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=windows-1252">
    <style>
      /* Reset styles for email clients */
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
                      alt="City X-Ray Clinic"
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
                    <p style="font-size: 13px; font-weight: bold;">
                      Thanks for submitting your feedback with us. We will get back to you soon.
                    </p>
                    <p><b>Patient Name:</b> ${first_name} ${last_name}</p>
                    <p><b>Patient Email:</b> ${email_id}</p>
                    <p><b>Mobile Number:</b> ${mobile_number}</p>
                    <p><b>Message:</b> ${message}</p>
                    <p><b>Feedback Id:</b> ${casecode}</p>
                    <p><b>Feedback Time:</b> ${feedbacktime}</p>
                    <p>
                      For any enquiry, call us on
                      <a href="tel:011-4725-2000" style="color: #DD861F; text-decoration: none;">+91-011-4725-2000</a>
                    </p>
                    <p><b>Thank you,</b></p>
                    <p><b>City X-Ray & Scan Clinic Pvt Ltd</b></p>
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
      subject: `CXR(Feedback)-${mobile_number}`,
      html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
      to: [
        "qmlab@cityxrayclinic.com",
        "qm@cityxrayclinic.com",
        "callcentre@cityxrayclinic.com",
        "draakaar@cityxrayclinic.com",
      ],
      from: process.env.EMAIL,
      cc: process.env.CC,
    });
    if (!savefeeds) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: savefeeds,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const OtpVerifyAndRegister = async (req, res) => {
  const { logger } = req;
  try {
    const type = req.query.type;
    const { your_phone, otp } = req.body;

    const verifyOTP = await feedbackModel.find({
      your_phone: your_phone,
      otp: otp,
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
      msg: Constant.INFO_MSGS.SUCCESSFUL_LOGIN,
      status: Constant.STATUS_CODE.OK,
      data: verifyOTP,
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

//getby Id

const getById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const inquiryData = await feedbackModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $project: {
          __v: 0,
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
  addfeedback,
  addnewfeedback,
  OtpVerifyAndRegister,
  getById,
};
