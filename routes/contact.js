const express = require("express");
const contactRoute = express.Router();
const contactController = require("../controller/contact/contact");

contactRoute.post("/add-contact",contactController.addContact);
contactRoute.get("/getAll",contactController.getAllContact);


module.exports = contactRoute;