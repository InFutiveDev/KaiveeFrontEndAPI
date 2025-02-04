const express = require("express");
const userRoute = express.Router();
const userController = require("../controller/user/user");
const { auth } = require("../middlewares/auth");
const { handleFormData } = require("../helpers/formFormidable");

userRoute.get("/getById", userController.getUserById);
userRoute.put("/update",handleFormData, userController.updateUserProfile);

module.exports = userRoute;
