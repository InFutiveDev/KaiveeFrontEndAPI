const express = require("express");
const hebitRouter = express.Router();
const hebitController = require("../controller/hebit/hebit");

hebitRouter.get("/getall", hebitController.getAllHebit);
hebitRouter.get("/getbyId/:id", hebitController.getHebitById);

module.exports = hebitRouter;

