const express = require("express");
const cityRouter = express.Router();
const cityController = require("../controller/city/city");


cityRouter.post("/add",cityController.addCity);


module.exports = cityRouter;