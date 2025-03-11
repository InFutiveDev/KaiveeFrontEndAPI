const bcrypt = require("bcrypt");
const moment = require("moment");
const User = require("../../models/user");
const otpModel = require("../../models/otp");
const randomString = require("crypto-random-string");
const SignupValidation = require("../../helpers/joi-validation");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const Email = require("../../helpers/email");
// const { sendOTP } = require("../../helpers/OTP");
const { sendMsg } = require("../../utility/OTP");
const { commonAuth } = require("./login");

const {
  EMAIL_VERIFICATION_URL,
  LOGIN_URL,
  EMAIL_VERIFY_TEMPLATE_ID,
  HOME_PAGE_URL,
  WELCOME_EMAIL_TEMPLATE_ID,
  FORGOT_PASSWORD_URL,
  FORGOT_PASSWORD_TEMPLATE_ID,
  OTP_DLT_TEMPLATE_ID
} = process.env;

/**
 * Register a new user with email and password
 */
const registerWithEmailAndPassword = async (req, res) => {
  const { logger } = req;
  try {
    const { name, email, password, city, mobile, type, gender, age } = req.body;

    const { error } = SignupValidation.registerWithEmailAndPassword({
      name,
      email,
      password,
    });
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }

    const userInfo = await User.findOne({ "email.id": email });
    if (userInfo) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.ACCOUNT_EXISTS,
      };
      // throw resp;
      // return handleException(logger, res, error);
      return Response.error(obj);
    }

    // Encrypt password By Bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);

    // Email Token Verification
    const token = randomString({
      length: 15,
      type: "url-safe",
    });

    // Create User Document in Mongodb
    const { _id } = await User.create({
      name,
      city,
      type,
      gender,
      age,
      email: {
        id: email,
        mobile,
        verified: false,
        registrationType: "Email",
        password: passwordHash,
        token: {
          token,
          createdAt: Date.now(),
        },
      },
    });

    let emailPayload = {
      name,
      email,
      verifyLink: `${EMAIL_VERIFICATION_URL}${token}`,
      loginLink: `${LOGIN_URL}`,
    };
    Email.Email(logger, EMAIL_VERIFY_TEMPLATE_ID, email, emailPayload);

    // Send Response To Client
    const obj = {
      res,
      status: Constant.STATUS_CODE.CREATED,
      msg: Constant.INFO_MSGS.VERIFICATION_EMAIL,
      data: {
        _id,
        name,
        email,
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};


/**
 * Send OTP On Mobile
 */
const axios = require('axios');

const sendOtp = async (req, res) => {
  const { logger } = req;
  try {
    const { mobile } = req.body;
    let OtpCode = null;

    // Generate OTP (Fixed for a specific number, random otherwise)
    if (mobile == "1234567890") {
      OtpCode = 999999;
    } else {
      OtpCode = Math.floor(100000 + Math.random() * 900000);
    }

    // Prepare Interakt API payload
    let data = JSON.stringify({
      countryCode: "+91",
      phoneNumber: mobile,
      callbackData: "OTP verification request",
      type: "Template",
      template: {
        name: "otp_0u",
        languageCode: "en",
        bodyValues: [OtpCode.toString()],
        buttonValues: {
          "0": [OtpCode.toString()]
        }
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.interakt.ai/v1/public/message/',
      headers: { 
        'Authorization': 'Basic Q29Ia1FkdGVNeTY5V2E1Q3Y1N1JiOUlJd1RmNHQteDUzZ2I4bTcxQTUwNDo=', 
        'Content-Type': 'application/json'
      },
      data: data
    };

    // Send OTP via Interakt
    await axios.request(config);

    // Save OTP to database
    const saveOtp = await otpModel.create({
      mobile: mobile,
      otp: OtpCode,
    });

    console.log("saveOtp", saveOtp);

    if (!saveOtp) {
      return Response.error({
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
      });
    } else {
      return Response.success({
        res,
        msg: Constant.INFO_MSGS.OTP_SENT_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
      });
    }

  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

/**
 * Register/login user with OTP and MOBILE
 */
const OtpVerifyAndRegister = async (req, res) => {
  const { logger } = req;
  try {
    const type = req.query.type;
    const { name, email, password, city, mobile, gender, age, otp } = req.body;

    const verifyOTP = await otpModel.findOneAndDelete({ mobile, otp });
    if (!verifyOTP) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.OTP_INVALID,
      };
      return Response.error(obj);
    }

    const userInfo = await User.findOne({ "email.mobile": mobile });
    //console.log("userInfo-->", userInfo);
    if (userInfo) {
      const data = await commonAuth(
        logger,
        userInfo.mobile,
        userInfo._id,
        req.clientIp,
        type
      );
      data.mobile = mobile;
      await User.findByIdAndUpdate(userInfo._id, {
        lastLogin: new Date(Date.now()),
      });
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESSFUL_LOGIN,
        status: Constant.STATUS_CODE.OK,
        data,
      };
      return Response.success(obj);
    }

    // Create User Document in Mongodb
    const addUser = await User.create({
      "email.mobile": mobile,
    });

    const data = await commonAuth(
      logger,
      addUser.mobile,
      addUser._id,
      req.clientIp,
      type
    );
    data.mobile = mobile;
    // Send Response To Client
    const obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESSFUL_LOGIN,
      status: Constant.STATUS_CODE.OK,
      data
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

/**
 * Customer Email id verification
 *
 * @param {string} token (token)
 */
const emailVerify = async (req, res) => {
  const { logger } = req;
  try {
    const { error } = SignupValidation.tokenVerification(req.body);
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }
    const { code } = req.body;
    const user = await User.findOne({
      "email.token.token": code,
    });
    if (!user) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.INVALID_CODE,
      };
      return Response.error(obj);
    } else if (user.email.verified) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.EMAIL_VERIFIED,
      };
      return Response.success(obj);
    } else {
      const userId = user._id;
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            "email.verified": true,
          },
        }
      );

      const payload = {
        name: user.name,
        homePageLink: `${HOME_PAGE_URL}`,
      };
      Email.Email(logger, WELCOME_EMAIL_TEMPLATE_ID, user.email.id, payload);
      const obj = {
        res,
        msg: Constant.INFO_MSGS.ACCOUNT_VERIFIED,
        status: Constant.STATUS_CODE.OK,
        data: {
          name: user.name,
          email: user.email.id,
        },
      };

      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

/**
 * Resend Email verification link
 *
 * @param {string} email (Email ID)
 */
const resendEmailVerification = async (req, res) => {
  const { logger } = req;
  try {
    const { error } = SignupValidation.emailVerification(req.body);
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }
    const { email } = req.body;
    const user = await User.findOne({
      "email.id": email,
    });
    if (!user) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.ACCOUNT_NOT_FOUND,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (!user.status) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (user.email.verified) {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.EMAIL_VERIFIED,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.error(obj);
    } else if (user.email.registrationType == "Google") {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.EMAIL_VERFICATION_NOT_NEEDED,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.error(obj);
    } else {
      const token = randomString({
        length: 15,
        type: "url-safe",
      });
      const userInfo = await User.findOneAndUpdate(
        {
          "email.id": email,
        },
        {
          "email.token.token": token,
          "email.token.createdAt": Date.now(),
        },
        {
          new: true,
        }
      );

      const payload = {
        name: userInfo.name,
        verifyLink: `${EMAIL_VERIFICATION_URL}${token}`,
        loginLink: `${LOGIN_URL}`,
      };
      Email.Email(logger, EMAIL_VERIFY_TEMPLATE_ID, email, payload);

      const obj = {
        res,
        msg: Constant.INFO_MSGS.VERIFICATION_EMAIL,
        status: Constant.STATUS_CODE.OK,
      };

      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

/**
 * Send a email with token to the user to reset the password
 *
 * @param {string} email (Email Id)
 */
const forgotPasswordLink = async (req, res) => {
  const { logger } = req;
  try {
    const { email, captchaToken } = req.body;
    const { error } = SignupValidation.emailVerification({ email });
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }

    const user = await User.findOne({
      "email.id": email,
    });

    if (!user) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.ACCOUNT_NOT_FOUND,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (!user.status) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (user.email.registrationType !== "Email") {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.CHANGE_PASSWORD_NOT_ALLOWED,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (!user.email.verified) {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.EMAIL_NOT_VERIFIED,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.error(obj);
    } else {
      const token = randomString({
        length: 15,
        type: "url-safe",
      });
      let tokenExpiryDate = moment(new Date(), "MM-DD-YYYY").add(2, "hours");

      const userInfo = await User.findOneAndUpdate(
        {
          "email.id": email,
        },
        {
          $set: {
            forgotPassword: {
              token: token,
              createdAt: Date.now(),
              expiryDate: tokenExpiryDate,
            },
          },
        },
        {
          new: true,
        }
      );

      const payload = {
        name: userInfo.name,
        verifyLink: `${FORGOT_PASSWORD_URL}${token}`,
      };
      await Email.Email(logger, FORGOT_PASSWORD_TEMPLATE_ID, email, payload);

      const obj = {
        res,
        msg: Constant.INFO_MSGS.EMAIL_SEND,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("forgotPasswordLink error", error);
    return handleException(logger, res, error);
  }
};

/**
 * Change the customer password
 *
 * @param {string} token (forgot password token)
 * @param {string} password (customer password)
 */
const resetPassword = async (req, res) => {
  const { logger } = req;
  try {
    const { code, password } = req.body;
    console.log(code);

    const user = await User.findOne({
      "forgotPassword.token": code,
    });

    if (!user) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.INVALID_CODE,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (!user.status) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (user.email.registrationType !== "Email") {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.CHANGE_PASSWORD_NOT_ALLOWED,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else if (!user.email.verified) {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.EMAIL_NOT_VERIFIED,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.error(obj);
    } else if (bcrypt.compareSync(password, user.email.password)) {
      const obj = {
        res,
        msg: Constant.ERROR_MSGS.OLD_PASSWORD,
        status: Constant.STATUS_CODE.BAD_REQUEST,
      };
      return Response.error(obj);
    } else {
      if (user.forgotPassword.expiryDate < new Date()) {
        const obj = {
          res,
          msg: Constant.ERROR_MSGS.FORGOT_PASSWORD_TOKEN_EXPIRED,
          status: Constant.STATUS_CODE.BAD_REQUEST,
        };
        return Response.error(obj);
      }
      const passHash = bcrypt.hashSync(password, 10);
      await User.findOneAndUpdate(
        {
          "forgotPassword.token": code,
        },
        {
          $set: {
            "email.password": passHash,
            "forgotPassword.token": null,
            "blocked.status": false,
            "blocked.expiry": null,
          },
        },
        {
          new: true,
        }
      );
      const obj = {
        res,
        msg: Constant.INFO_MSGS.PASSWORD_CHANGED,
        status: Constant.STATUS_CODE.OK,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("resetPassword Error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  registerWithEmailAndPassword,
  OtpVerifyAndRegister,
  emailVerify,
  resendEmailVerification,
  forgotPasswordLink,
  resetPassword,
  sendOtp,
};
