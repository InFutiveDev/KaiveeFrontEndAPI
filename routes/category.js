const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controller/category/category");

categoryRouter.get("/getAll", categoryController.getAllCategory);
categoryRouter.get("/getAllParent", categoryController.getAllParentCategory);
categoryRouter.get("/get-byId/:id", categoryController.getCategoryById);

module.exports = categoryRouter;
