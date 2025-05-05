const express = require("express");
const technicianRouter = express.Router();
const technicianController = require("../controller/technician/technician");


technicianRouter.get("/getAll",technicianController.getAlltechnician);
technicianRouter.get("/getByid/:id",technicianController.gettechnicianByname);


module.exports = technicianRouter;