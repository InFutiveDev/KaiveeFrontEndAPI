const express = require("express");
const notificationsRoute = express.Router();
const notificationsControllers = require("../controller/notifiy/notification");



notificationsRoute.delete("/delete/:id", notificationsControllers.deleteNotification);
notificationsRoute.get("/getnotification", notificationsControllers.getEnabledNotifications);
notificationsRoute.get("/getnotification/user/:userId", notificationsControllers.getNotificationsByUserId);

module.exports = notificationsRoute;