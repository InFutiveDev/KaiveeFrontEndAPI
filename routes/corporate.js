const express = require("express");
const corporateRoute = express.Router();
const corporateController = require("../controller/corporate_form/corporate");

corporateRoute.post("/add-corporate",corporateController.addCorporate);
corporateRoute.get("/getAll",corporateController.getAllCoporate);


module.exports = corporateRoute;