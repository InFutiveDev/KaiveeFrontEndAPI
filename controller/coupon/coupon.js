const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const couponModel = require("../../models/coupon");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const getAllCoupon = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    date = new Date();
    let qry = {};
    if (str || date) {
      qry["$or"] = [
        { coupon_code: { $regex: str, $options: "i" } },
        { validity: { $gte: date } },
      ];
    }

    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const couponData = await couponModel.aggregate([
      {
        $match: qry,
      },
      {
        $match: {
          validity: { $gte: new Date() },
        },
      },

      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(couponData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          couponData: [],
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
        couponData: couponData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: couponData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const applyCoupon = async (req, res) => {
  try {
    let { couponCode, totalCartAmount, selectedTest } = req.body;
    const couponData = await couponModel.findOne({ coupon_code: couponCode });

    if (!couponData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.INVALID_COUPON_CODE,
      };
      return Response.error(obj);
    }

    if (new Date() > couponData.validity) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.COUPON_EXPIRED,
      };
      return Response.error(obj);
    }

    if (totalCartAmount < couponData.minimum_amount) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.LESS_AMOUNT + " " + couponData.minimum_amount,
      };
      return Response.error(obj);
    }

    let discountAmount = 0;

    if (couponData.valid_all_test) {
      // Coupon is valid for all tests
      if (couponData.discount_type === "percent-discount") {
        discountAmount = totalCartAmount * (couponData.discount / 100);
        if (discountAmount > couponData.max_value) {
          discountAmount = couponData.max_value;
        }
      } else if (couponData.discount_type === "flat-discount") {
        discountAmount = couponData.discount;
      }
    } else if (couponData.selected_test && selectedTest) {
      // Coupon is valid for a specific selected test
      if (selectedTest.toString() === couponData.addTest.toString()) {
        // Ensure selectedTest matches addTest
        if (couponData.discount_type === "percent-discount") {
          discountAmount = totalCartAmount * (couponData.discount / 100);
          if (discountAmount > couponData.max_value) {
            discountAmount = couponData.max_value;
          }
        } else if (couponData.discount_type === "flat-discount") {
          discountAmount = couponData.discount;
        }
      } else {
        const obj = {
          res,
          status: Constant.STATUS_CODE.BAD_REQUEST,
          msg: "invalid test", // You need to define this constant
        };
        return Response.error(obj);
      }
    } else {
      // If the coupon is not valid for either scenario, respond with an error
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.COUPON_NOT_APPLICABLE, // Define this constant
      };
      return Response.error(obj);
    }

    const finalAmount = totalCartAmount - discountAmount;

    const obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESS,
      status: Constant.STATUS_CODE.OK,
      data: {
        discountAmount,
        finalAmount,
        discountType:
          couponData.discount_type === "percent-discount" ? "Percent" : "Flat",
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getAllCoupon,
  applyCoupon,
};