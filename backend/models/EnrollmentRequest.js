
const mongoose = require('mongoose');

const enrollmentRequestSchema = new mongoose.Schema({
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
  courseName: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true
  },
  utrNumber: {
    type: String,
    required: true
  },
  transactionNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: { 
    type: Date, 
    default: Date.now 
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const EnrollmentRequest = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);

module.exports = EnrollmentRequest;
