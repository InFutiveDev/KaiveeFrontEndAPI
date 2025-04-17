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
    const { first_name, last_name, mobile_number, email_id, message,rating } =
      req.body;

    var caseCode = Math.floor(10000 + Math.random() * 90000);

    const savefeeds = await feedbackModel.create({
      first_name,
      last_name,
      mobile_number,
      email_id,
      message,
      rating,
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
    const { first_name, last_name, mobile_number, email_id, message, rating } =
      req.body;

    var casecode = Math.floor(10000 + Math.random() * 90000);

    const savefeeds = await feedModel.create({
      first_name,
      last_name,
      mobile_number,
      email_id,
      message,
      rating,
      caseCode: casecode,
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
