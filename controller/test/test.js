const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const testModel = require("../../models/test");
const categoryModel = require("../../models/category");
const mongoose = require("mongoose");
const _ = require("underscore");
const { async } = require("crypto-random-string");
const { ObjectId } = mongoose.Types;

// GET ALL TEST DATA
// str = (enter any string For searching Using Regex Query)
// page = (enter page No. for pagination )
// limit = (enter limit for Per page Data )
const getAllTest = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit, HealthRisk, Habit, Categories } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { package_type: { $regex: str, $options: "i" } },
        { specialityName: { $regex: str, $options: "i" } },
        { test_name: str },
        { search_tag: { $regex: str, $options: "i" } },
        { also_known_as : { $regex: str, $options: "i" } },
      ];
    }
    if (HealthRisk) {
      const healthRiskIds = HealthRisk.split(",").map(id => ObjectId(id.trim()));
      qry["$or"] = qry["$or"] || [];
      qry["$or"].push({ "by_healthRisk._id": { $in: healthRiskIds } });
    }

    if (Habit) {
      const habitIds = Habit.split(",").map(id => ObjectId(id.trim()));
      qry["$or"] = qry["$or"] || [];
      qry["$or"].push({ "by_habits._id": { $in: habitIds } });
    }
    if (Categories) {
      qry["$or"] = [
        { cat_id: ObjectId(Categories) },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const testData = await testModel.aggregate([
      {
        $match: qry
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $sort: {
          position: -1
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    
    if (_.isEmpty(testData[0].paginatedResult )) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          testData: [],
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
        testData: testData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: testData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getTestById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let matchQuery;

    if (_id.length !== 24) {
      matchQuery = { test_url: _id };
    } else {
      matchQuery = { _id: mongoose.Types.ObjectId(_id) };
    }

    const testData = await testModel.aggregate([
      {
        $match: matchQuery
      },
      {
        $match: {
          test_status: true,
        },
      },
      {
        $project: {
          also_known_as: 1,
          cat_id: 1,
          department: 1,
          meta_desc: 1,
          meta_keyword: 1,
          meta_title: 1,
          mrp: 1,
          no_of_parameters: 1,
          offer_price: 1,
          package_type: 1,
          search_tag: 1,
          specialityName: 1,
          test_components: 1,
          test_name: 1,
          test_pre_test_info: 1,
          test_status: 1,
          test_type: 1,
          test_url: 1,
          collection_type: 1,
          package_image: 1,
          package_image_altTag: 1,
          related_tests: 1,
          report: 1,
          avilability: "$reporting",
          test_price_info: 1,
          preparation: 1,
          number_of_review: 1,
          number_of_star: 1,
        }
      }
    ]);

    if (!testData || testData.length === 0) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
      };
      return Response.error(obj);
    }

    const obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESS,
      status: Constant.STATUS_CODE.OK,
      data: testData,
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};



const testListByCategory = async (req, res) => {
  const { logger } = req;
  try {
    let { page, limit, str } = req.query;
    let cat_id = req.params.id;
    let qry = {};
    if (str) {
      qry["$or"] = [
        { package_type: { $regex: str, $options: "i" } },
        { specialityName: { $regex: str, $options: "i" } },
        { test_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);

    // TEST-LIST BY CATEGORY (USING CATEGORY ID)
    // TEST DATA GET USING CATEGORY ID
    const categoryData = await testModel.aggregate([
      {
        $match: { cat_id: mongoose.Types.ObjectId(cat_id) },
      },
      {
        $match: qry,
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $sort: {
          position: -1
        }
      },
      {
        $project: {
          _id: 1,
          code: 1,
          // __v: 1,
          cat_id: 1,
          createdAt: 1,
          department: 1,
          meta_desc: 1,
          meta_keyword: 1,
          meta_title: 1,
          mrp: 1,
          no_of_parameters: 1,
          offer_price: 1,
          package_type: 1,
          search_tag: 1,
          package_image: 1,
          package_image_altTag: 1,
          specialityName: 1,
          test_name: 1,
          test_status: 1,
          test_url: 1,
          updatedAt: 1,
          by_habits: 1,
          by_healthRisk: 1,
          number_of_star: { $ifNull: ["$number_of_star", "5"] },
          number_of_review: { $ifNull: ["$number_of_review", "0"] },
        },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
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

const getAllPackage = async (req, res) => {
  const { logger } = req;

  try {
    let { page, limit, Hebbit } = req.query;
    //   let qry = {};


    //   if (Hebbit) {
    //     qry["$or"] = [
    //       { by_habits: ObjectId(Hebbit) },
    //     ];
    //   }

    const str = ['health-package'];

    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);

    // GETALL PACKAGE-LIST FROM TEST MODEL USING STR COMPARE WITH PACKAGE_TYPE FIELD
    const categoryData = await testModel.aggregate([
      {
        $match: { package_type: { $in: str } },

        // $match: qry,
      },
      {
        $sort: {
          position: 1
        }
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
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

// GET ALL TEST DATA BY HEBBIT ID
// /:ID  {ENTER HEBBIT ID IN QUERY PARAMS }
// page = (enter page No. for pagination )
// limit = (enter limit for Per page Data )
const getTestByHebbitId = async (req, res) => {
  const { logger } = req;
  try {
    let { page, limit, str } = req.query;
    let hebbit_id = req.params.id;
    // console.log(cat_id);

    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);

    // TEST-LIST BY HEBBIT (USING CATEGORY ID)
    // TEST DATA GET USING HEBBIT ID
    const testDataByHebbitId = await testModel.aggregate([
      {
        $match: { by_habits: mongoose.Types.ObjectId(hebbit_id) },
      },
      {
        $sort: {
          position: -1
        }
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(testDataByHebbitId[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          testDataByHebbitId: [],
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
        testDataByHebbitId: testDataByHebbitId[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: testDataByHebbitId[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

//by healthriskId

const getTestByHealthriskId = async (req, res) => {
  const { logger } = req;
  try {
    let { page, limit, str } = req.query;
    let healthrisk_id = req.params.id;
    // console.log(cat_id);

    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);

    // TEST-LIST BY HEBBIT (USING CATEGORY ID)
    // TEST DATA GET USING HEBBIT ID
    const testDataByHealthriskId = await testModel.aggregate([
      {
        $match: { by_healthRisk: mongoose.Types.ObjectId(healthrisk_id) },
      },
      {
        $sort: {
          position: -1
        }
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(testDataByHealthriskId[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          testDataByHealthriskId: [],
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
        testDataByHealthriskId: testDataByHealthriskId[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: testDataByHealthriskId[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};
// const getScheduleData = async(req,res)=>{
//   const  url= 'http://122.176.75.191/CityLab/Design/Lab/Services/MobileAppInfo.asmx/ItemMaster_RateType?AccessToken=563d4b4f086a62c099023abd84cfb1f9&RateTypeID=78';
//   try {
//     const responseData = await axios.get({url});
//     if (!responseData) {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
//       };
//       return Response.error(obj);
//     } else {
//       const obj = {
//         res,
//         msg: Constant.INFO_MSGS.SUCCESS,
//         status: Constant.STATUS_CODE.OK,
//         data: responseData,
//       };
//       return Response.success(obj);
//     }

//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// }

// // Schedule the task to run every 12 hours
// cron.schedule('* 12 * * *', getScheduleData);


// const getcollection = async (req, res) => {
//   const { logger } = req;
//   try {
//     let { sortBy, str, page, limit } = req.query;

//     let qry = {};
//     if (str) {
//       qry["$or"] = [
//         { package_type: { $regex: str, $options: "i" } },
//         { specialityName: { $regex: str, $options: "i" } },
//         { test_name: { $regex: str, $options: "i" } },
//       ];
//     }
//     offset = page || 1;
//     limit = limit || 20;
//     const skip = limit * (offset - 1);
//     const testData = await testModel.find();
//     for(const collection_type of testData){
//       await testModel.updateMany({
//           collection_type:"home collection"
//         });

//      }
//      const obj = {
//       res,
//       msg: Constant.INFO_MSGS.SUCCESS,
//       status: Constant.STATUS_CODE.OK,
//       data: testData,
//     };
//     return Response.success(obj);
//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };
// const getconvertparameter = async (req, res) => {
//   const { logger } = req;
//   try {
//     let { sortBy, str, page, limit } = req.query;

//     let qry = {};
//     if (str) {
//       qry["$or"] = [
//         { package_type: { $regex: str, $options: "i" } },
//         { specialityName: { $regex: str, $options: "i" } },
//         { test_name: { $regex: str, $options: "i" } },
//       ];
//     }
//     offset = page || 1;
//     limit = limit || 20;
//     const skip = limit * (offset - 1);
//     const testData = await testModel.find();
//     for(const  no_of_parameters of testData){
//       await testModel.updateMany({    
//            no_of_parameters:0
//         });

//      }
//      const obj = {
//       res,
//       msg: Constant.INFO_MSGS.SUCCESS,
//       status: Constant.STATUS_CODE.OK,
//       data: testData,
//     };
//     return Response.success(obj);
//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };

const testListByfeaturedCategory = async (req, res) => {
  const { logger } = req;
  try {
    let { page, limit, str } = req.query;
    let cat_id = req.params.id;
    let qry = {};
    if (str) {
      qry["$or"] = [
        { package_type: { $regex: str, $options: "i" } },
        { specialityName: { $regex: str, $options: "i" } },
        { test_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);

    // TEST-LIST BY CATEGORY (USING CATEGORY ID)
    // TEST DATA GET USING CATEGORY ID
    const categoryData = await testModel.aggregate([
      {
        $match: { cat_id: mongoose.Types.ObjectId(cat_id) },

      },
      {
        $match: qry,
      },
      {
        $match:{
          test_status:true
        }
      },
      {
        $match: { featured_test: true },
      },
      {
        $sort: {
          position: -1
        }
      },
      {
        $project: {
          _id: 1,
          code: 1,
          // __v: 1,
          cat_id: 1,
          createdAt: 1,
          department: 1,
          meta_desc: 1,
          meta_keyword: 1,
          meta_title: 1,
          mrp: 1,
          no_of_parameters: 1,
          offer_price: 1,
          package_type: 1,
          search_tag: 1,
          specialityName: 1,
          test_name: 1,
          test_status: 1,
          test_url: 1,
          updatedAt: 1,
          package_image: 1,
          package_image_altTag: 1,
          by_habits: 1,
          by_healthRisk: 1,
          featured_test: 1,
          number_of_star: { $ifNull: ["$number_of_star", "5"] },
          number_of_review: { $ifNull: ["$number_of_review", "0"] },
        },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
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




module.exports = {
  getAllTest,
  getTestById,
  testListByCategory,
  getAllPackage,
  getTestByHebbitId,
  getTestByHealthriskId,
  //getcollection,
  // getconvertparameter,
  testListByfeaturedCategory,

};
