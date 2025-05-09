const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'enrolled', 'started', 'completed'],
    default: 'enrolled'
  },
  enrolledAt: { 
    type: Date,
    default: Date.now 
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedDays: {
    type: [Number],
    default: []
  }
});

// Compound index to prevent duplicate enrollments
userCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserCourse = mongoose.model('UserCourse', userCourseSchema);

module.exports = UserCourse;
