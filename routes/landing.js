const express = require("express");
const landingPageRouter = express.Router();
const landingPageController = require("../controller/landingpage/landingpage");



landingPageRouter.get("/getall",landingPageController.getAlllandingpage);
landingPageRouter.get("/getById/:id",landingPageController.getLandingPageById);

module.exports = landingPageRouter;