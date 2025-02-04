const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const membershipCardModel = require("../../models/membership_card");
const mongoose = require("mongoose");
const _ = require("underscore");


const addcard = async(req,res)=>{
    const{logger} = req;
   // console.log(req);
    try{
        const{
            cardMember_name,
            cardMember_email,
            cardMember_mobile,
            cardMember_test,
            cardMember_status,
        } = req.body;
        const savecard = await membershipCardModel.create({
            cardMember_name,
            cardMember_email,
            cardMember_mobile,
            cardMember_test,
            cardMember_status,
        });
        if (!savecard) {
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
              data: savecard,
            };
            return Response.success(obj);
          }
        } catch (error) {
          console.log("error", error);
          return handleException(logger, res, error);
        }
};

const getById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const saveData = await membershipCardModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (!saveData) {
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
        data: saveData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
    addcard,
    getById,
};