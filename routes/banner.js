const express = require("express");
const bannerRouter = express.Router();
const bannerController = require("../controller/banner/banner");

bannerRouter.get("/getById/:id", bannerController.getBannerById);
bannerRouter.get("/getAll", bannerController.getAllBanner);

module.exports = bannerRouter;
