const { handleException } = require("../../../helpers/exception");
const Response = require("../../../helpers/response");
const Constant = require("../../../helpers/constant");
const inquiryModel = require("../../../models/inquiry");
const testModel = require("../../../models/test");
const bookingModel = require("../../../models/booking");
const _ = require("underscore");
const mongoose = require("mongoose");
const { sendMsg } = require("../../../utility/OTP");
const { ObjectId } = mongoose.Types;
const jose = require('node-jose');
const axios = require('axios');
const Razorpay = require('razorpay');




const generatePayment = (payload) => {
    return new Promise(async (resolve, reject) => {
        console.log('payload 1', payload);
        const currentTimeStamp = new Date();

        // Add 15 minutes to the current timestamp
        const fifteenMinutesLater = new Date(currentTimeStamp.getTime() + 15 * 60000); // 15 minutes * 60 seconds * 1000 milliseconds

        // Get the timestamp value
        const timestampValue = fifteenMinutesLater.getTime();



        let data = JSON.stringify({
            "amount": payload.amount * 100,
            "currency": "INR",
            "description": "Test",
            "customer": {
                "name": payload.first_name,
                "email": payload.customer_email,
                "contact": payload.customer_phone,
            },
            "notify": {
                "sms": true,
                "email": true
            },
            "expire_by": timestampValue,
            "callback_url": payload.return_url
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.razorpay.com/v1/payment_links',
            headers: {
                'Authorization': 'Basic ' + process.env.PAYMENT_TOKEN,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (response) => {
                // console.log('response.data',JSON.stringify(response.data));
                await bookingModel.findOneAndUpdate({ id: payload.order_id },
                    {
                        payment_gateway_link: response.data.short_url,
                        payment_gateway_link_id: response.data.id,
                    },
                    {
                        new: true,
                    }
                );
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    });
};



const checkOrderStatusRazorpay = (payload) => {
    return new Promise(async (resolve, reject) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.razorpay.com/v1/payments/' + payload.payment_id,
            headers: {
                'Authorization': 'Basic ' + process.env.PAYMENT_TOKEN,
                'Content-Type': 'application/json'
            }
        };
        axios.request(config)
            .then(async (response) => {
                // console.log(JSON.stringify(response.data));
                // console.log('response.data',response.data)
                if (response.data.status == "captured") {
                    await bookingModel.findOneAndUpdate({ payment_gateway_link_id: payload.payment_link_id },
                        {
                            is_paid: response.data.status == "captured" ? true : false,
                            payment_gateway_response: response.data.status
                        },
                        {
                            new: true,
                        }
                    );
                    resolve(response.data);
                } else {
                    let bookingData = await bookingModel.findOne({ payment_gateway_link_id: payload.payment_link_id });
                    let obj = {
                        msg: "Payment Not Done",
                        amount: response.data.amount,
                        order_id: bookingData.id,
                        finaleData: response.data,
                        payment: false,
                    }
                    resolve(obj);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

module.exports = {
    generatePayment,
    checkOrderStatusRazorpay
};