const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const addressModel = require("../../models/address");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addAddress = async (req, res) => {
  const { logger } = req;

  try {
    const { userId } = req.decoded;
    const {
      address1,
      near_by_locality,
      date_add,
      time,
      address_type,
      city,
      state,
      postCode,
    } = req.body;
    const saveAddress = await addressModel.create({
      userId,
      address1,
      near_by_locality,
      date_add,
      time,
      address_type,
      city,
      state,
      postCode,
    });
    if (!saveAddress) {
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
        data: saveAddress,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateAddress = async (req, res) => {
  const { logger } = req;
  try {
    // const { userId } = req.decoded;
    const _id = req.params.id;
    let updateAddressData = await addressModel.findByIdAndUpdate(
      { _id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateAddressData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.INFO_MSGS.NO_DATA,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: updateAddressData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteAddress = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteAddressData = await addressModel.findByIdAndDelete({ _id });
    if (!deleteAddressData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.INFO_MSGS.NO_DATA,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.DELETED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: deleteAddressData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAddressById = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    const addressData = await addressModel.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (!addressData) {
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
        data: addressData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
};
