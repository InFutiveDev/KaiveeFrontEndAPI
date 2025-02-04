const express = require("express");
const inquiryRouter = express.Router();
const inquiryController = require("../controller/inquiry/inquiry");
const { auth } = require("../middlewares/auth");


inquiryRouter.post("/add", inquiryController.addInquiry);
 inquiryRouter.post("/verify-otp",inquiryController.OtpVerifyAndRegister);
inquiryRouter.get("/getById/:id", inquiryController.getInquiryById);

module.exports = inquiryRouter;
