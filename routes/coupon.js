const express = require("express");
const couponRouter = express.Router();
const couponController = require("../controller/coupon/coupon");

couponRouter.get("/getAll", couponController.getAllCoupon);
couponRouter.post("/applycoupon",couponController.applyCoupon);

module.exports = couponRouter;
