const express = require("express");
const prescriptionRouter = express.Router();
const prescriptionController = require("../controller/prescriptionUpload/prescription");
const { handleFormData } = require("../helpers/formFormidable");

prescriptionRouter.post("/add",handleFormData,prescriptionController.addprescription);
//prescriptionRouter.post("/verify-otp",prescriptionController.OtpVerifyAndRegister);
prescriptionRouter.get("/getby-id/:id",prescriptionController.getById);

module.exports = prescriptionRouter;