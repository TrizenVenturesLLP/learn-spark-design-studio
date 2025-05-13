
const mongoose = require('mongoose');

const mcqOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const mcqQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [mcqOptionSchema],
  explanation: String
});

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
  dayNumber: {
    type: Number,
    required: true
  },
  questions: [mcqQuestionSchema],
  dueDate: {
    type: Date,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
