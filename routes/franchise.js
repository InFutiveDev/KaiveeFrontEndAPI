const express = require("express");
const franchiseRoute = express.Router();
const franchiseController = require("../controller/franchise/franchise");

franchiseRoute.post("/add-franchise",franchiseController.addFranchise);
franchiseRoute.get("/getAll",franchiseController.getAllFranchise);


module.exports = franchiseRoute;