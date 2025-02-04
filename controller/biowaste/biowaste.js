const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const biowasteModel = require("../../models/biowaste");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const getbiowasteByMonth = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    //const testData = await testModel.find({_id: mongoose.Types.ObjectId(_id)});
    const wasteData = await biowasteModel.aggregate([
      {
        $match: { 
          
          months : _id 
        },
      },
    ]);
    if (!wasteData) {
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
        data: wasteData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllwaste = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, months,year, page, limit } = req.query;

   
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const wasteData = await biowasteModel.aggregate([
      {
        $match: {months,year}
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(wasteData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          wasteData: [],
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
        wasteData: wasteData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: wasteData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


  module.exports ={
    getbiowasteByMonth,
    getAllwaste,
  }