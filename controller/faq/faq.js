const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const faqModel = require("../../models/faq");
const mongoose = require("mongoose");
const _ = require("underscore");

const getAllFAQ = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { faq_title: { $regex: str, $options: "i" } },
        ];
      }
      offset = page || 1;
      limit = limit || 4;
      const skip = limit * (offset - 1);
      const listFAQ = await faqModel.aggregate([
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
      if (_.isEmpty(listFAQ[0].paginatedResult)) {
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
          testData: listFAQ[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: listFAQ[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getFAQBytestId = async (req, res) => {
    const { logger } = req;
    try {
        let { page, limit, str } = req.query;
        let test_id = req.params.id;
      
    
        offset = page || 1;
        limit = limit || 10;
        const skip = limit * (offset - 1);
    

        let faqTestIdData = [];
        if (test_id.length != 24) {
          faqTestIdData = await faqModel.aggregate([
            {
              $match: { test_url: test_id },
            },
            {
              $facet: {
                paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
                totalCount: [{ $count: "count" }],
              },
            },
          ]);
        } else {
          faqTestIdData = await faqModel.aggregate([
            {
              $match: { test_id: mongoose.Types.ObjectId(test_id) },
            },
            {
              $facet: {
                paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
                totalCount: [{ $count: "count" }],
              },
            },
          ]);
        }
       
        // FAQ DATA GET USING Test ID
        if (_.isEmpty(faqTestIdData[0].paginatedResult)) {
          obj = {
            res,
            status: Constant.STATUS_CODE.OK,
            msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
            data: {
              faqTestIdData: [],
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
            faqTestIdData : faqTestIdData[0].paginatedResult,
            pagination: {
              offset: parseInt(offset),
              limit: parseInt(limit),
              total: faqTestIdData[0].totalCount[0].count,
            },
          },
        };
        return Response.success(obj);
      } catch (error) {
        console.log("error", error);
        return handleException(logger, res, error);
      }
  };
  const deleteFaq = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteFaqData = await faqModel.findByIdAndDelete({ _id });
      if (!deleteFaqData) {
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
          data: deleteFaqData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };


  module.exports = {
    getAllFAQ,
    getFAQBytestId,
    deleteFaq,

  }