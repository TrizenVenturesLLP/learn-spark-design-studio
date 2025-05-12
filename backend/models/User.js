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
    enum: ['student', 'instructor', 'admin'],  // Added 'instructor' role
    default: 'student'
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'instructor' ? 'pending' : 'approved';
    }
  },
  instructorProfile: {
    specialty: { 
      type: String,
      required: function() { return this.role === 'instructor'; }
    },
    experience: { 
      type: Number,
      required: function() { return this.role === 'instructor'; }
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    rating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    // Additional instructor profile fields
    bio: {
      type: String,
      default: ''
    },
    phone: {
      type: String
    },
    location: {
      type: String
    },
    avatar: {
      type: String
    },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String }
    },
    teachingHours: {
      type: Number,
      default: 0
    }
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
