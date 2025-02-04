const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const familyMemberModel = require("../../models/familyMember");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addMember = async (req, res) => {
  const { logger } = req;

  try {
    const { fullName, age, gender, phone, relation } = req.body;
    
    const { userId } = req.decoded;
    const saveMember = await familyMemberModel.create({
      fullName,
      phone,
      age,
      gender,
      relation,
      userId,
    });
    if (!saveMember) {
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
        data: saveMember,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateMember = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateMemberData = await familyMemberModel.findByIdAndUpdate(
      { _id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateMemberData) {
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
        data: updateMemberData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteMember = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteMemberData = await familyMemberModel.findByIdAndDelete({ _id });
    if (!deleteMemberData) {
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
        data: deleteMemberData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getMemberById = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;

    const memberData = await familyMemberModel.find({userId: mongoose.Types.ObjectId(userId)});
    if (!memberData) {
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
        data: memberData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addMember,
  updateMember,
  deleteMember,
  getMemberById,
};
