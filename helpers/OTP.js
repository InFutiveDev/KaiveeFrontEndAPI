const axios = require("axios");
var needle = require("needle");
const _ = require("underscore");
const moment = require("moment");

const {
  OTP_API_KEY,
  OTP_SENDER_ID,
  OTP_DLTTemplate_ID,
  OTP_SMS_API_URL,
  OTP_SERVICE_NAME,
} = process.env;

/**
 * Send OTP through smsapi
 */

module.exports.otpResendWow = (payload, callback) => {
  let link = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${config.smsapiKey}&MobileNo=${payload.phoneNo}&SenderID=APKAZR&Message=Your OTP for AAPKABAZAR is ${payload.otp}&ServiceName=TEMPLATE_BASED`;
  needle.get(link, function (err, response) {
    console.log(err);
    if (err) callback(err, null);
    else callback(null, response);
  });
};

const sendOTP = (phoneNumber, otp) => {
  return new Promise(async (resolve, reject) => {
    const apiKey = OTP_API_KEY;
    const senderId = OTP_SENDER_ID;
    const DLTTemplateID = OTP_DLTTemplate_ID;
    const ServiceName = OTP_SERVICE_NAME;
    const message = `Your Login OTP is ${otp}, Please Do not Share anyone. - InFutive`;

    // Abhay
    let link = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${apiKey}&MobileNo=${phoneNumber}&SenderID=${senderId}&Message=Your Login OTP is ${otp}, Please Do not Share anyone. - InFutive&ServiceName=TEMPLATE_BASED`;
    needle.get(
      link,
      ((err, result) => {
        if (result) {
          // console.log("OTP sent successfully");
          // console.log("result-->",result);
          resolve(result);
        } else {
          // console.log("err-->",err);
          // console.log("err Message-->",err.message);
          reject(err.message);
        }
      })
    );


    //Nidhi

    // await axios
    //   .post(OTP_SMS_API_URL, null, {
    //     params: {
    //       APIKEY: apiKey,
    //       SenderID: senderId,
    //       MobileNo: phoneNumber,
    //       Message: message,
    //       DLTTemplateID: DLTTemplateID,
    //       ServiceName: ServiceName,
    //     },
    //   })
    //   .then((result) => {
    // console.log("OTP sent successfully");
    // console.log("res-->", result);
    // console.log("otp-Data", result.data);
    // resolve(result);
    // })
    // .catch((err) => {
    // console.error("Failed to send OTP");
    // console.log(JSON.stringify(err));
    // reject(err.message);
    // });
  });
};

module.exports = {
  sendOTP,
};
