const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const UserPreference = require('../../models/userprefrence');

const NotificationCategory = require('../../models/notificationCategory');
const userModel = require("../../models/user");
const { default: mongoose } = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

// @desc    Get all preferences for current user
// @route   GET /api/preferences
// @access  Private
const getUserPreferences = async (req, res, next) => {
  try {
    const { userId } = req.decoded;
    const preferences = await UserPreference.find({ user: userId })
      .populate('category', 'name description color icon');

    res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update or create user preference for a category
// @route   PUT /api/preferences/:categoryId
// @access  Private
exports.updatePreference = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const categoryId = req.params.categoryId;
    
    // Verify category exists
    const category = await NotificationCategory.findById(categoryId);
    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${categoryId}`, 404));
    }

    // Check if preference already exists
    let preference = await UserPreference.findOne({
      user: req.user.id,
      category: categoryId
    });

    if (preference) {
      // Update existing preference
      preference = await UserPreference.findOneAndUpdate(
        { user: req.user.id, category: categoryId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('category', 'name description color icon');
    } else {
      // Create new preference
      preference = await UserPreference.create({
        user: req.user.id,
        category: categoryId,
        ...req.body
      });
      preference = await UserPreference.findById(preference._id)
        .populate('category', 'name description color icon');
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle category enabled status
// @route   PUT /api/preferences/:categoryId/toggle
// @access  Private
const toggleCategory = async (req, res, next) => {
  try {
    const { userId } = req.decoded;
    const categoryId = req.params.categoryId;
    
    // Verify category exists
    const category = await NotificationCategory.findById(categoryId);
    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${categoryId}`, 404));
    }

    // Find or create preference
    let preference = await UserPreference.findOne({
      user: userId,
      category: categoryId
    });

    if (preference) {
      // Toggle existing preference
      preference = await UserPreference.findOneAndUpdate(
        { user: userId, category: categoryId },
        { 
          enabled: !preference.enabled,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      ).populate('category', 'name description color icon');
    } else {
      // Create new preference (disabled by default)
      preference = await UserPreference.create({
        user: userId,
        category: categoryId,
        enabled: false
      });
      preference = await UserPreference.findById(preference._id)
        .populate('category', 'name description color icon');
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update all preferences at once
// @route   PUT /api/preferences
// @access  Private
exports.updateAllPreferences = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { preferences } = req.body;
    const updateOperations = [];
    
    // Validate preferences
    if (!Array.isArray(preferences)) {
      return next(new ErrorResponse('Preferences must be an array', 400));
    }
    
    // Process each preference update
    for (const pref of preferences) {
      if (!pref.category) {
        return next(new ErrorResponse('Each preference must include a category ID', 400));
      }
      
      // Verify category exists
      const category = await NotificationCategory.findById(pref.category);
      if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${pref.category}`, 404));
      }
      
      // Create updateOne operation
      updateOperations.push({
        updateOne: {
          filter: { user: req.user.id, category: pref.category },
          update: { 
            $set: { 
              ...pref,
              user: req.user.id,
              updatedAt: Date.now()
            } 
          },
          upsert: true
        }
      });
    }
    
    // Execute bulk operation
    await UserPreference.bulkWrite(updateOperations);
    
    // Fetch updated preferences
    const updatedPreferences = await UserPreference.find({ user: req.user.id })
      .populate('category', 'name description color icon');
    
    res.status(200).json({
      success: true,
      count: updatedPreferences.length,
      data: updatedPreferences
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset preferences to defaults
// @route   POST /api/preferences/reset
// @access  Private
exports.resetPreferences = async (req, res, next) => {
  try {
    // Delete all existing preferences
    await UserPreference.deleteMany({ user: req.user.id });
    
    // Get all categories
    const categories = await NotificationCategory.find();
    
    // Create default preferences for each category
    const defaultPreferences = categories.map(category => ({
      user: req.user.id,
      category: category._id,
      enabled: true,
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false
    }));
    
    await UserPreference.insertMany(defaultPreferences);
    
    // Fetch created preferences
    const preferences = await UserPreference.find({ user: req.user.id })
      .populate('category', 'name description color icon');
    
    res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
toggleCategory,
getUserPreferences,
 }
