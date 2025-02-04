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

let uuid = "key_bdcf8979dfe54fa9b3f9717be1a0905b";
let privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIEpQIBAAKCAQEA1AVVUI4NXdafKH5UFtT+Y8uBt5/Ho3FvfLlqGYW3KK3k7MWLqpV74hZgFzIwEkmPx0AL2UxdMY0C10hVhHVY2kv96zJZRdSLHAQLrGYVVukULSzHqiEe9VLSN5Kx160zjk401HWQJFHKaGcezS0HqvjZecWDYh4quA9qB8I8F9EpxTDHjR60qKnfSfkiNqScjvw9RS5UpWhyqm7OsAe3zDA3AyKFoQ2aUotJQ5Xxbt8HZLluh72gvBSp8dcNnhSxud0s17IJBOTpwWYyMQylbkkqXGtkZuI0YzThs0VNs4/JUtGssMupgCQe3qZHoksJJIu5pkhxFAgMVB6iI6K71QIDAQABAoIBAQDHUdg5qcHBJSJtJA4ThNs+oDPrl4dMDTk9LOYk5kMhOBGN0c0SagOTsWtWgzUUDBnhvEEnYJYAHku8beEPbG5Cksw8TxIEBuNcTCVZRoLrOKViLsXqF8cN5HWCDyOn2cktEDK0RW1j54x8h+06AApEXju9McTo+ek5LiyE7MIntCGuNz/fe30Bap2ZL3Uxho25XMyTPo4H0oFNGrO/n7P/Ln84/PLX0HwNnh4fucMGOZ9Uli9QnkJ1HJYZE/W1+A0wouCYbuDEX12m05uSR/3OuNr0HPUOpQMRDmV/EkkFGgttdvNd9f4r/9rZsl+pQVShfSW+TLFIe1pej2EE9yQFAoGBAPO6ov9xQorQks/nLkm027dpJ94ddFA3ARADJ7zajnqsq8k/0X9nmcvYWLxi2yopZlefymlTp362jmX9OzS+shCZln9upabfg2bXzPa/lWEkT6pEfSHKpmblOJx0NmAie9Jc3wpZ6MbZIXM+9krYQZMQki1QOQ3MZoyLQvkmk9QjAoGBAN6yBGfC7Ua7E5pd2PnExSvNLaTywLBzcAcH6J3Sc3GoE6uJ+9Mb/cgLeLoWBO5v+sbBIj6tesLG22cSWLsNPfF+0AxaZ2EZD3szJ78Ty4pIaNeCNuUTkV6zQH2mXyZxvWyW7WY/qXLmpDzvCEgqD7gkB/HUvCI+UQ6Xd6cXpFOnAoGBAL8HG1YmyUbPryHwSiFO9Z7Ndofqgg2U7upD7tNgYafYylPUBzlaU/qnOPV+bdSf2iz3esgO3wq7vuRFFDCE/j9wgbqjWIZwTSdAIM+M3WHj+eS0BXeEw+OF6VcG5s92d6IrVE1ipsWjzUnsoVGMKelAZbHKXM1p1T52sCljiR4NAoGAMLsZta71ByZGyt/AbB9/2e7jDxZDzhjkqdU0NNzpgDR8YWwnW/HjHdRMzcOlvptob/exS6/gjiC/wBVGr1/dbywF0L4zow690YLHLsvhHVhtAMOwyX33sJZfBV/TsHDxN4LrXhWOOeN4ixDvagMyP2Q7DNM1e/TQ/fVtLHZC8j8CgYEAojRS0kU/JyZ6zXwPjOOvwfuMy2f+k+Yn+TmpFkUFsfBpqqu4zqyS7tRbOFk8U0U8WEYX7VHWMYxkBV47u/zU0Syrsh59pQf+ChkR512Gz9z01iX7nClytz37O+Dw9XmaTnZrcwDFsmvtPKANL/tyrr1GUoiicat0yQkWac55J4Q=-----END RSA PRIVATE KEY-----";
let publicKey = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXHWlKkSOPRwmzvAxNCzcWW6vFfQZCBplM0cTFTIOonR9/1uC6Rwc1/fQR9mulKMhS2tAAnFh8p8WoXNWY3UiNtqGYTNoAeAoourYMXdxMUfDyfUrS/Dg1HgokupcBE35OFoM1LVPFBMJ8Yw8WZXHu75HKkU65YXwl8Ak61wKxpNt+UsmHgn4/KiBBY+XvcLS35Tzymr+VZ4fl8FqwYw8aKRVHAOBnWkNbRR9Z4XX96pQ4/q7Om+nL4CvTWvalf7HReEd7jV3sOvVFuPbFwU1RdSj4J+tegnIMYbBU49iqX1KZqi/vVxZllnn861z80f9RCy3QLZKN0Dq0biUaoyFQIDAQAB-----END PUBLIC KEY-----";
const generatePaymentLinkManual = async (req, res) => {
    const { logger } = req;
    try {
        // const { userId } = req.decoded;
        const returndata = await jwtEncryptRequest(req.body, uuid, publicKey, privateKey);
        let data = JSON.stringify({
            "encryptedPayload": returndata.encryptedPayload,
            "encryptedKey": returndata.encryptedKey,
            "header": returndata.header,
            "tag": returndata.tag,
            "iv": returndata.iv,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://smartgatewayuat.hdfcbank.com/v4/session',
            headers: {
                'x-merchantid': 'SG032',
                'x-customerid': 'hdfcmaster',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (response) => {
                // console.log('finaldata',JSON.stringify(response.data));
                const finaleData = await jwtDecryptRequest(response.data, publicKey, privateKey);
                const obj = {
                    res,
                    msg: Constant.INFO_MSGS.PAYMENT_LINK_CREATED_SUCCESSFULLY,
                    status: Constant.STATUS_CODE.OK,
                    data: finaleData,
                };
                return Response.success(obj);
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log("error", error);
        return handleException(logger, res, error);
    }
};




const generatePaymentLink = (payload) => {
    return new Promise(async (resolve, reject) => {
        // const { userId } = req.decoded;
        console.log('payload', payload);
        const returndata = await jwtEncryptRequest(payload, uuid, publicKey, privateKey);
        let data = JSON.stringify({
            "encryptedPayload": returndata.encryptedPayload,
            "encryptedKey": returndata.encryptedKey,
            "header": returndata.header,
            "tag": returndata.tag,
            "iv": returndata.iv,
        });
        console.log('data', data)

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://smartgatewayuat.hdfcbank.com/v4/session',
            headers: {
                'x-merchantid': 'SG032',
                'x-customerid': 'hdfcmaster',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (response) => {
                // console.log('finaldata',JSON.stringify(response.data));
                const finaleData = await jwtDecryptRequest(response.data, publicKey, privateKey);
                console.log('finaleData', finaleData)
                // await bookingModel.findOneAndUpdate({ id: payload.order_id },
                //     {
                //         paymentJsonPayloadReq:payload,
                //         paymentjwtEncryptRequest:data.toString(),
                //         paymentjwtDecryptRequest:response.data,
                //         paymentJsonResponse:finaleData,
                //     },
                //     {
                //         new: true,
                //     }
                // );
                resolve(finaleData);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};




const checkOrderStatus = (payload) => {
    return new Promise(async (resolve, reject) => {
        // const { userId } = req.decoded;
        console.log('payload', payload);
        const returndata = await jwtEncryptRequest(payload, uuid, publicKey, privateKey);
        let data = JSON.stringify({
            "encryptedPayload": returndata.encryptedPayload,
            "encryptedKey": returndata.encryptedKey,
            "header": returndata.header,
            "tag": returndata.tag,
            "iv": returndata.iv,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://smartgatewayuat.hdfcbank.com/v4/order-status',
            headers: {
                'x-merchantid': 'SG032',
                'x-customerid': 'hdfcmaster',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (response) => {
                const finaleData = await jwtDecryptRequest(response.data, publicKey, privateKey);
                // console.log('finaleData', finaleData)
                let output1 = 'payment_gateway_response' in finaleData;
                if (output1) {
                    await bookingModel.findOneAndUpdate({ id: payload.order_id },
                        {
                            is_paid: finaleData.payment_gateway_response.resp_code === "SUCCESS" ? true : false,
                            payment_gateway_response: finaleData.payment_gateway_response.resp_code
                        },
                        {
                            new: true,
                        }
                    );
                    resolve(finaleData);
                } else {
                    let obj = {
                        msg: "Payment Not Done",
                        amount: finaleData.amount,
                        order_id: finaleData.order_id,
                        finaleData: finaleData,
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



/**
 * @param {string} data data to be encrypted
 * @param {string} keyId key uuid
 * @param {string} publicKeyString public key
 * @param {string} privateKeyString private key
 * @returns string encrypted request
 */
async function jwtEncryptRequest(
    data,
    keyId,
    publicKeyString,
    privateKeyString
) {
    const privateKey = await jose.JWK.asKey(privateKeyString, `pem`);
    const publicKey = await jose.JWK.asKey(publicKeyString, 'pem');
    let userPayload;
    try {
        userPayload = JSON.stringify(data);
    } catch (error) {
        throw new Error(
            `Error parsing the payload, here's the error log:- ${error.message}`
        );
    }
    // console.log(typeof data);
    // console.log(userPayload);

    if (keyId === undefined || keyId === '') {
        throw new Error('Key id cannot be empty/undefined');
    }

    const signer = jose.JWS.createSign(
        { fields: { alg: 'RS256', kid: keyId }, format: 'flattened' },
        privateKey
    ).update(userPayload);

    const signedResult = await signer.final();
    const signedJws = JSON.parse(JSON.stringify(signedResult));
    const signedJwsTransform = {
        payload: signedJws.payload,
        signature: signedJws.signature,
        header: signedJws.protected,
    };

    const encryptHandler = jose.JWE.createEncrypt(
        {
            format: 'flattened',
            contentAlg: 'RSA-OAEP-256',
            fields: {
                enc: 'A256GCM',
                cty: 'JWT',
                kid: keyId,
                alg: 'RSA-OAEP-256',
            },
            protect: ['kid', 'enc', 'cty', 'alg'],
        },
        publicKey
    ).update(JSON.stringify(signedJwsTransform));

    const res = await encryptHandler.final();
    const encryptedJWE = JSON.parse(JSON.stringify(res));
    const encryptedJWETransform = {
        header: encryptedJWE.protected,
        encryptedKey: encryptedJWE.encrypted_key,
        iv: encryptedJWE.iv,
        encryptedPayload: encryptedJWE.ciphertext,
        tag: encryptedJWE.tag,
    };
    return encryptedJWETransform;
}

/**
 * @param {string} body data to be decrypted {"header": "", "encryptedPayload": "", "encryptedKey", "iv": "", "tag": ""}, response from server
 * @param {string} publicKeyString public key
 * @param {string} privateKeyString private key
 * @returns string decrypted request
 */
async function jwtDecryptRequest(body, publicKeyString, privateKeyString) {
    const privateKey = await jose.JWK.asKey(privateKeyString, `pem`);
    const publicKey = await jose.JWK.asKey(publicKeyString, 'pem');
    const jweBody = {
        protected: body.header,
        ciphertext: body.encryptedPayload,
        encrypted_key: body.encryptedKey,
        iv: body.iv,
        tag: body.tag,
    };

    return await jose.JWE.createDecrypt(privateKey)
        .decrypt(JSON.parse(JSON.stringify(jweBody)))
        .then(async (jws) => {
            const jwsBody = JSON.parse(Buffer.from(jws.payload).toString());

            const token = `${jwsBody.header}.${jwsBody.payload}.${jwsBody.signature}`;

            return await jose.JWS.createVerify(publicKey)
                .verify(token)
                .then((verifiedRes) =>
                    JSON.parse(Buffer.from(verifiedRes.payload).toString())
                );
        });
}

module.exports = {
    generatePaymentLink,
    generatePaymentLinkManual,
    checkOrderStatus
};
