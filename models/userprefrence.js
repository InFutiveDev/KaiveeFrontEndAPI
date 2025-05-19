const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationCategory',
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  emailEnabled: {
    type: Boolean,
    default: true
  },
  pushEnabled: {
    type: Boolean,
    default: true
  },
  smsEnabled: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound unique index for user and category
UserPreferenceSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);