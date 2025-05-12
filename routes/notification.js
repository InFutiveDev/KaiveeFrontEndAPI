const express = require("express");
const notificationsRoute = express.Router();
const notificationsControllers = require("../controller/notifiy/notification");



notificationsRoute.delete("/delete/:id", notificationsControllers.deleteNotification);
notificationsRoute.get("/getnotification", notificationsControllers.getEnabledNotifications);

module.exports = notificationsRoute;