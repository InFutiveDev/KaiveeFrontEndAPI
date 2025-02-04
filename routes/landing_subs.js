const express = require("express");
const subscribeRoute = express.Router();
const landing_subscriber = require("../controller/landing_page_subscribe.js/subscribe");

subscribeRoute.post("/add",landing_subscriber.addsubscriber);


module.exports = subscribeRoute;