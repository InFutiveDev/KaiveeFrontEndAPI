const express = require("express");
const inquiryRouter = express.Router();
const inquiryController = require("../controller/inquiry/landing_inquiry");



inquiryRouter.post("/add", inquiryController.addInquiry);


module.exports = inquiryRouter;
