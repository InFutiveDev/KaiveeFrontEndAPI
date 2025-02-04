const express = require("express");
const teamRouter = express.Router();
const teamController = require("../controller/team/team");


teamRouter.get("/getAll",teamController.getAllteam);
teamRouter.get("/getByid/:id",teamController.getteamByname);

module.exports = teamRouter;