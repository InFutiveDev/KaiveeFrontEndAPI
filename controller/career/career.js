const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const careerModel = require("../../models/career");
const _ = require("underscore");


const getAllCareer = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { job_title: { $regex: str, $options: "i" } },
        { job_Type_1: { $regex: str, $options: "i" } },
        { job_Type_2: { $regex: str, $options: "i" } },
        { Job_Status: { $regex: str, $options: "i" } }
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const careerData = await careerModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort: {createdAt: -1 }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(careerData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          careerData: [],
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
        careerData: careerData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: careerData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const getByIdCarrer = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let matchQuery;

    if (_id.length !== 24) {
      matchQuery = { job_title_url: _id };
    } else {
      matchQuery = { _id: mongoose.Types.ObjectId(_id) };
    }

    const CarrerData = await careerModel.aggregate([
      {
        $match: matchQuery
      },
      {
        $match : {Job_Status:"Active"}
      },
      
      {
        $project: {
          __v:0
          
        }
      }
    ]);

    if (!CarrerData) {
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
        data: CarrerData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getAllCareer,
  getByIdCarrer,
};
