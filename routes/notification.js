const express = require("express");
const notificationsRoute = express.Router();
const notificationsControllers = require("../controller/notifiy/notification");
const {
  getUserPreferences,
  updatePreference,
  updateAllPreferences,
  resetPreferences,
  toggleCategory
} = require('../controller/notifiy/prefrence');

notificationsRoute.put('/toggle/:categoryId/toggle', toggleCategory);

notificationsRoute.get("/getnotification", notificationsControllers.getUserNotifications);
notificationsRoute.get("/getnotification/:id", notificationsControllers.getSingleUserNotification);
notificationsRoute.put("/markread/:id", notificationsControllers.markAsRead);
notificationsRoute.put("/markAllread/", notificationsControllers.markAllAsRead);
notificationsRoute.put("/archive/:id", notificationsControllers.archiveNotification);
notificationsRoute.delete("/delete/:id", notificationsControllers.deleteUserNotification);
notificationsRoute.get("/getcategories", notificationsControllers.getCategories);


module.exports = notificationsRoute;