const express = require("express");
const carrer_formRouter = express.Router();
const carrer_formController = require("../controller/carrer_form/carrer_form");
const { handleFormData } = require("../helpers/formFormidable");



carrer_formRouter.post("/add",handleFormData, carrer_formController.addCarrer);


module.exports = carrer_formRouter;
