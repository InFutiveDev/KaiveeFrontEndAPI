const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const userModel = require("../../models/user");
const bookingModel = require("../../models/booking");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const ProfileValidation = require("../../helpers/joi-validation");
const { async } = require("crypto-random-string");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");


const getUserById = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    const userData = await userModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(userId) },
      },
      
      {
        $project: {
          mobile: "$email.mobile",
          email: "$email.id",
          name: 1,
          gender: 1,
          age: 1,
          profilePicture :1
        },
      },
    ]);
    if (!userData) {
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
        data: userData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateUserProfile = async (req, res) => {
  const { logger } = req;
  try {
    const userDetails={};
    const { userId } = req.decoded;
    const { name, mobile, email, gender, age,profilePicture } = req.data;
  // console.log(req.data);
    if(typeof req.data.profilePicture === "string" || !req.files.profilePicture){
    }
    else{
     
     const profileImage = req.files.profilePicture.filepath;
    // firebase logic to upload the image
      let uploadedImage = await bucket.upload(profileImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.profilePicture.originalFilename
        }`,
      
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data =  uploadedImage;

     const mediaLinkhome = data[0].metadata.mediaLink;
     userDetails.profilePicture = mediaLinkhome;
    }
    //console.log(profilePicture);
  
  
    const { error } = ProfileValidation.updateUserProfile(req.data);
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }
    const updateuserDetails = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          "email.mobile": mobile,
          "email.id": email,
          name: name,
          gender: gender,
          age: age,
          ...userDetails,
  
        },
      },
      { new: true }
    );
    const obj = {
      res,
      status: Constant.STATUS_CODE.OK,
      msg: Constant.INFO_MSGS.SUCCESSFUL_UPDATE,
      data: {mobile:updateuserDetails.email.mobile, email: updateuserDetails.email.id, name: updateuserDetails.name, profilePicture:updateuserDetails.profilePicture,gender:updateuserDetails.gender,age:updateuserDetails.age },
    };
    return Response.success(obj);
  } catch (error) {
    return handleException(logger, res, error);
  }
};



module.exports = {
  getUserById,
  updateUserProfile,
  
};
