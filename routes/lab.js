const { Router } = require("express");
const labRoute = Router();
const labController = require("../controller/booking/labController");


labRoute.get("/byId/:id", labController.getByIdLabDetail);
labRoute.get("/getAll", labController.getAllLabDetail);

module.exports = labRoute;
