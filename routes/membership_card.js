const express = require("express");
const membership_cardRouter = express.Router();
const membership_cardController = require("../controller/membershipCard/membership_card");

membership_cardRouter.post("/add",membership_cardController.addcard);
membership_cardRouter.get("/getBy-id/:id",membership_cardController.getById);

module.exports = membership_cardRouter;