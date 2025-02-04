const express = require("express");
const reasearchRouter = express.Router();
const reasearchController = require("../controller/reasearch/reasearch");
const { handleFormData } = require("../helpers/formFormidable");

reasearchRouter.post(
  "/add-file",
  handleFormData,
  reasearchController.addreasearch
);
reasearchRouter.get("/getAll", reasearchController.getAllreasearch);
reasearchRouter.get("/getByid/:id", reasearchController.getReasearchById);
reasearchRouter.post("/add-form", reasearchController.addReasearchform);

module.exports = reasearchRouter;
