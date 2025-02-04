const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controller/appointment/appointment");

appointmentRouter.post("/add",appointmentController.addappointment);
appointmentRouter.get("/getby-id",appointmentController.getById);

module.exports = appointmentRouter;