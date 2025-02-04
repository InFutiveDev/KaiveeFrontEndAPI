const express = require("express");
const biowasteRouter = express.Router();
const biowasteController = require("../controller/biowaste/biowaste");

biowasteRouter.get("/getwaste/:id",biowasteController.getbiowasteByMonth);
biowasteRouter.get("/getAllList",biowasteController.getAllwaste);

module.exports = biowasteRouter;