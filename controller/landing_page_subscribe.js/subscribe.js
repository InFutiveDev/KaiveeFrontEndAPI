const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const subscribeModel = require("../../models/landing_subs");

const addsubscriber = async (req, res) => {
    const { logger } = req;
  
    try {
      const {
        subsriber_email,
      } = req.body;
    
      const subscribeData = await subscribeModel.create({
        
        subsriber_email,
  
      });
      
      if (!subscribeData) {
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
          data: subscribeData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports ={
    addsubscriber,
  }
  