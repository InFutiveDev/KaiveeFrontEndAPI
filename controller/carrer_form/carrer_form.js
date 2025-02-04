const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const carrerFormModel = require("../../models/carrer_apply");
const mongoose = require("mongoose");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../../utility/mail");

const addCarrer = async (req, res) => {
  const { logger } = req;

  try {
    const Cv_document = req.files.Cv_document.filepath;
    const {
      First_name,
      Last_name,
      Email,
      Mobile,
      State,
      City,
      Experince,
      Current_company,
      Current_salary,
      Expected_salary,
      linkedIn,
      job_applied,
    } = req.data;

    // firebase logic to upload the image
    let uploaded = bucket.upload(Cv_document, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.Cv_document.originalFilename
      }`,
      // destination:image.filename,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;

    const saveCarrer_form = await carrerFormModel.create({
      Cv_document: mediaLink,
      First_name,
      Last_name,
      Email,
      Mobile,
      State,
      City,
      Experince,
      Current_company,
      Current_salary,
      Expected_salary,
      linkedIn,
      job_applied,
    });

    const htmlTemplate = `
        <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=windows-1252">
    <style>
      /* General Reset */
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
                      alt="CityImaging"
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
                    <p>&nbsp;</p>
                    <p style="font-size: 13px; font-weight: bold;">
                      Thanks for submitting your resume with us. We will get back to you soon.
                    </p>
                    <p>Name: ${First_name + " " + Last_name}</p>
                    <p>Job Applied: ${job_applied}</p>
                    <p>Email: ${Email}</p>
                    <p>Phone Number: ${Mobile}</p>
                    <p>Resume: <a href="${mediaLink}" style="color: #DD861F; text-decoration: none;">View Resume</a></p>
                    <p>Experience: ${Experince}</p>
                    <p>Current Company: ${Current_company}</p>
                    <p>Current Salary: ${Current_salary}</p>
                    <p>Expected Salary: ${Expected_salary}</p>
                    <p>City: ${City}</p>
                    <p>
                      For any enquiry call us on
                      <a href="tel:011-4725-2000" style="color: #DD861F; text-decoration: none;">+91-011-4725-2000</a>
                    </p>
                    <div><b>Thank you,</b></div>
                    <div><b>City X-Ray & Scan Clinic Pvt Ltd</b></div>
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
      subject: `CXR(Applied Job enquiry)-${Mobile}`,
      html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
      to: "hr@cityxrayclinic.com",
      from: process.env.EMAIL,
      cc: process.env.CC,
    });

    if (!saveCarrer_form) {
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
        data: saveCarrer_form,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addCarrer,
};
