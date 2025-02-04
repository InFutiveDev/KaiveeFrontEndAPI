const express = require("express");
const feedbackRouter = express.Router();
const feedbackController = require("../controller/feedback/feedback");
const { auth } = require("../middlewares/auth");

feedbackRouter.post("/new/add",feedbackController.addnewfeedback);
feedbackRouter.post("/otp-verify",feedbackController.OtpVerifyAndRegister);
feedbackRouter.get("/getby-id/:id",feedbackController.getById);

module.exports = feedbackRouter;