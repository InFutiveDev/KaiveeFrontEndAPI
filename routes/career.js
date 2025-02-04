const express = require("express");
const careerRouter = express.Router();
const careerController = require("../controller/career/career");



careerRouter.get("/get-carrer",careerController.getAllCareer);
careerRouter.get("/byId/:id",careerController.getByIdCarrer);

module.exports = careerRouter;
