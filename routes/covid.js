const express = require("express");
const covidRouter = express.Router();
const covidController = require("../controller/covid-19/covid");
const { handleFormData } = require("../helpers/formFormidable");


covidRouter.post("/add",handleFormData,covidController.addCovidlist);
covidRouter.get("/getAll",covidController.getAllCovidData);

module.exports = covidRouter;
