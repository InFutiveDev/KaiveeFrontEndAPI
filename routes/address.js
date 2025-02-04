const express = require("express");
const addressRouter = express.Router();
const addressController = require("../controller/address/address");
const { auth } = require("../middlewares/auth");

addressRouter.post("/add", auth, addressController.addAddress);
addressRouter.get("/getById", auth, addressController.getAddressById);
addressRouter.put("/update/:id", addressController.updateAddress);
addressRouter.delete("/delete/:id", addressController.deleteAddress);

module.exports = addressRouter;
