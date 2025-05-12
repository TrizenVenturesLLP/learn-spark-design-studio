
const mongoose = require('mongoose');

// Define schema for MCQ questions
const mcqQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'MCQ'
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true,
    default: 1
  }
});

// Define schema for coding questions
const codingQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'CODING'
  },
  problemStatement: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  marks: {
    type: Number,
    required: true,
    default: 10
  },
  sampleCode: {
    type: String
  }
});

// Define discriminator options
const questionOptions = {
  discriminatorKey: 'type',
  timestamps: true
};

// Define the assessment schema
const assessmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['MCQ', 'CODING'],
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  assignedDays: [{
    type: Number,
    required: true
  }],
  dueDate: {
    type: Date,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
assessmentSchema.index({ courseId: 1 });
assessmentSchema.index({ assignedDays: 1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
