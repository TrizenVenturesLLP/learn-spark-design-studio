
const mongoose = require('mongoose');

// Define the schema for MCQ submissions
const mcqSubmissionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'MCQ'
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswer: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean
  },
  marks: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String
  }
});

// Define the schema for coding submissions
const codingSubmissionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'CODING'
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  testResults: [{
    passed: Boolean,
    output: String,
    error: String,
    testCaseIndex: Number
  }],
  marks: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String
  }
});

// Define the main submission schema
const assessmentSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  totalMarks: {
    type: Number,
    default: 0
  },
  maxMarks: {
    type: Number,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['graded', 'pending'],
    default: 'pending'
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
assessmentSubmissionSchema.index({ studentId: 1, assessmentId: 1 }, { unique: true });
assessmentSubmissionSchema.index({ assessmentId: 1 });

const AssessmentSubmission = mongoose.model('AssessmentSubmission', assessmentSubmissionSchema);

module.exports = AssessmentSubmission;
