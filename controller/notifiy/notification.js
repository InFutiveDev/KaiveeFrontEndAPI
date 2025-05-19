const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const notificationModel = require("../../models/notifications");
const notificationCategoryModel = require("../../models/notificationCategory");
const userModel = require("../../models/user");


const { default: mongoose } = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;


  
const getUserNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const { userId } = req.decoded;
    const filter = { user: userId };
    
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === 'true';
    }
    
    if (req.query.isArchived !== undefined) {
      filter.isArchived = req.query.isArchived === 'true';
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const total = await notificationModel.countDocuments(filter);
    
    const notifications = await notificationModel.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pagination = {};

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    if (startIndex + notifications.length < total) {
      pagination.next = { page: page + 1, limit };
    }

    res.status(200).json({
      success: true,
      count: notifications.length,
      pagination,
      total,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single notification for current user
// @route   GET /api/notifications/:id
// @access  Private
const getSingleUserNotification = async (req, res, next) => {
  const { userId } = req.decoded;
  try {
    const notification = await notificationModel.findOne({
      _id: req.params.id,
      user: userId
    }).populate('category');

    if (!notification) {
      return handleException(null, res, { status: 404, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, user: req.decoded.userId },
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return handleException(null, res, { status: 404, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.decoded;
    const result = await notificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: result.nModified,
      message: `${result.nModified} notifications marked as read`
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};

// @desc    Archive notification
// @route   PUT /api/notifications/:id/archive
// @access  Private
const archiveNotification = async (req, res, next) => {
  try {
    const { userId } = req.decoded;
    const notification = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { isArchived: true },
      { new: true, runValidators: true }
    );

     if (!notification) {
      return handleException(null, res, { status: 404, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};

// @desc    Delete user notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteUserNotification = async (req, res, next) => {
  try {
    const notification = await notificationModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return handleException(null, res, { status: 404, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await notificationCategoryModel.find().sort('name');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    return handleException(null, res, err);
  }
};


module.exports = {
   
  getUserNotifications,
  getSingleUserNotification,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteUserNotification,
  getCategories
 
};