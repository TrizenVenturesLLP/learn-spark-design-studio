
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  rating: { type: Number, required: true },
  students: { type: Number, default: 0 },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Intermediate'],
    required: true
  },
  category: { type: String, required: true },
  skills: [{ type: String }],
  courses: [{
    title: { type: String },
    details: { type: String }
  }],
  testimonials: [{
    text: { type: String },
    author: { type: String },
    since: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
