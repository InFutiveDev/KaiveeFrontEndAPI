const express = require("express");
const paymentRouter = express.Router();
const paymentController = require("../controller/payment-gateway/hdfc/hdfc");
// const { auth } = require("../middlewares/auth");
paymentRouter.post("/generate-link", paymentController.generatePaymentLinkManual);

module.exports = paymentRouter;
