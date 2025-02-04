const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const categoryModel = require("../../models/category");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const getAllParentCategory = async (req, res) => { 
  const { logger } = req;
  try {
    let { sortBy, str, page } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { category_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    const skip =  (offset - 1);
    const categoryData = await categoryModel.aggregate([
      {
        $match: qry,
        
      },
      {
        $match: {perent_category_name:null},
        
      },
      {
        $sort: {
          position: 1,
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(categoryData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          categoryData: [],
          pagination: {
            offset: parseInt(offset),
            limit: 0,
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: 0,
          total: categoryData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllCategory = async (req, res) => { 
  const { logger } = req;
  try {
    let { sortBy, str, page } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { category_name: { $regex: str, $options: "i" } },
        { perent_category_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    const skip =  (offset - 1);
    const categoryData = await categoryModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort: {
          position: 1,
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(categoryData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          categoryData: [],
          pagination: {
            offset: parseInt(offset),
            limit: 0,
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: 0,
          total: categoryData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const getCategoryById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    // const categoryData = await categoryModel.find({_id: mongoose.Types.ObjectId(_id)});
    const categoryData = await categoryModel.aggregate([
      {
        $match:
         { category_url:_id
          //_id: mongoose.Types.ObjectId(_id)
         },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent_category_data",
           foreignField: "_id",
          as: "parentData",
        },
      },
      {
        $unwind: { path: "$parentData", preserveNullAndEmptyArrays: true },
      },
      {
      $project:{
      category_name:1,
      parent_category_data:"$parentData",
      category_menu_active:1,
      category_url:1,
      category_image:1,
      mobile_banner:1,
      category_image_altTag:1,
      home_image:1,
      home_image_altTag:1,
      category_desc:1,
      category_article:1,
      meta_title:1,
      meta_desc: 1,
      meta_keyword: 1,
      position:1
      }
    }
    ]);
    if (!categoryData) {
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
        data: categoryData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


module.exports = {
  getAllParentCategory,
  getAllCategory,
  getCategoryById
};
