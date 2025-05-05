
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
    default: 0
  },
  enrolledAt: { 
    type: Date,
    default: Date.now 
  }
});

// Compound index to prevent duplicate enrollments
userCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserCourse = mongoose.model('UserCourse', userCourseSchema);

module.exports = UserCourse;
