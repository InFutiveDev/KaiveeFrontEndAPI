const express = require("express");
const healthRiskRouter = express.Router();
const healthRiskController = require("../controller/HealthRisk/healthRisk");

healthRiskRouter.get("/getAll", healthRiskController.getAllHealthRisk);
healthRiskRouter.get("/getById/:id", healthRiskController.getHealthRiskById);


module.exports = healthRiskRouter;
