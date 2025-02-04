const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("../controller/booking/booking");
const { auth } = require("../middlewares/auth");

bookingRouter.post("/add", bookingController.addBooking);
bookingRouter.get("/getById", bookingController.getBookingById);
bookingRouter.get("/check-booking-status", bookingController.checkOrderStatusByOrderID);
bookingRouter.get("/check-booking-razorpay-status", bookingController.checkOrderStatusByOrderIDRazorpay);
bookingRouter.get("/paymentstatus", bookingController.bookingPayment);

module.exports = bookingRouter;
