// var needle = require("needle");
const axios = require("axios");

const { SMS_USER, SMS_PASSWORD, SMS_SENDER_ID } = process.env;

const sendMsg = (payload) => {
  return new Promise(async (resolve, reject) => {
    // console.log('Hello')

    // let link = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${SMS_API_KEY}&MobileNo=${payload.mobile}&SenderID=${SMS_SENDER_ID}&Message=${payload.message}&ServiceName=TEMPLATE_BASED&DLTTemplateID=${payload.template_id}`
    // let link = `https://103.229.250.200/smpp/sendsms?username=${SMS_USER}&password=${SMS_PASSWORD}&to=${payload.mobile}&from=${SMS_SENDER_ID}&text=${payload.message}`;
    // console.log("link", link);
    // needle.get(link, (err, result) => {
    //   if (result) {
    //     console.log("result", result.body);
    //     resolve(result);
    //   } else {
    //     console.log("err123333", err);
    //     reject(err.message);
    //   }
    // });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://103.229.250.200/smpp/sendsms?username=${SMS_USER}&password=${SMS_PASSWORD}&to=${payload.mobile}&from=${SMS_SENDER_ID}&text=${payload.message}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(err.message);
      });
  });
};

module.exports = {
  sendMsg,
};
