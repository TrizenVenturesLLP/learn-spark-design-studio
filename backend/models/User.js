const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bio: {
    type: String,
    default: ''
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  notificationPreferences: {
    courseUpdates: { type: Boolean, default: true },
    assignmentReminders: { type: Boolean, default: true },
    discussionReplies: { type: Boolean, default: true }
  },
  connectedDevices: [{
    id: String,
    name: String,
    type: String,
    browser: String,
    lastActive: Date
  }],
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    method: { type: String, enum: ['app', 'sms'], default: 'app' },
    phone: String,
    secret: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
