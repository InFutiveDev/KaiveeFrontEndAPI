const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const corporateModel = require("../../models/corporate");
const _ = require("underscore");
const { sendEmail } = require("../../utility/mail");

const addCorporate = async (req, res) => {
  const { logger } = req;
  try {
    const {
      your_name,
      company_name,
      your_email,
      mobile_number,
      select_enquiry,
    } = req.body;
    const corporateData = await corporateModel.create({
      your_name,
      company_name,
      your_email,
      mobile_number,
      select_enquiry,
    });

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
                      Thanks for submitting your enquiry with us. We will get back to you soon.
                    </p>
                    <p><b>Name:</b> ${your_name}</p>
                    <p><b>Email:</b> ${your_email}</p>
                    <p><b>Phone Number:</b> ${mobile_number}</p>
                    <p><b>Company Name:</b> ${company_name}</p>
                    <p><b>Enquiry Type:</b> ${select_enquiry}</p>
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
      subject: `CXR(Corporate)-${mobile_number}`,
      html: htmlTemplate.replace(/{{([^}]+)}}/g, (match, key) => data[key]),
      to: "corporate@cityimaging.in",
      from: process.env.EMAIL,
      cc: process.env.CC,
    });
    if (!corporateData) {
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
        data: corporateData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllCoporate = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { your_name: { $regex: str, $options: "i" } },
        { your_email: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const corporateData = await corporateModel.aggregate([
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
    if (_.isEmpty(corporateData[0].paginatedResult)) {
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
        corporateData: corporateData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: corporateData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addCorporate,
  getAllCoporate,
};
