const express = require("express");
const mediaRoute = express.Router();
const mediaController = require("../controller/media/media");

mediaRoute.get("/getById/:id", mediaController.getMediaById);
mediaRoute.get("/getAll", mediaController.getAllMedia);

module.exports = mediaRoute;
