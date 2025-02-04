const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const cityModel = require("../../models/city");

const addCity = async(req,res)=>{
    const{logger} = req;
    try{
        const{
            city_name,
            pincode,
            state_name,
        } = req.body;
        const savecity = await cityModel.create({
            city_name,
            pincode,
            state_name,
        });
        if (!savecity) {
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
              data: savecity,
            };
            return Response.success(obj);
          }
        } catch (error) {
          console.log("error", error);
          return handleException(logger, res, error);
        }
};

module.exports = {
    addCity,
}