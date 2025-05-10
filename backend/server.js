const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS for image requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MongoDB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const UserCourse = require('./models/UserCourse');
const Discussion = require('./models/Discussion');

// Create EnrollmentRequest model
const enrollmentRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  utrNumber: {
    type: String,
    required: true,
  },
  transactionScreenshot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const EnrollmentRequest = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);

// Create ContactRequest model
const contactRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
  },
}, { timestamps: true });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Add this after the transporter configuration
const sendEnrollmentApprovalEmail = async (enrollmentRequest) => {
  const mailOptions = {
    from: `"Trizen Ventures LLP" <${process.env.EMAIL_USER}>`,
    to: enrollmentRequest.userId.email,
    subject: '🎉 Your Enrollment Has Been Approved – Welcome to the Course!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #007BFF;">Enrollment Confirmation</h2>
          <p>Dear ${enrollmentRequest.userId.name || 'Student'},</p>

          <p>We are pleased to inform you that your enrollment in the course <strong>"${enrollmentRequest.courseId.title}"</strong> has been officially approved.</p>

          <p>You now have full access to all course materials, resources, and support. We encourage you to dive in and begin your learning journey with us.</p>

          <p>At <strong>Trizen Ventures LLP</strong>, we're committed to delivering world-class education and helping professionals like you unlock their full potential.</p>

          <p>If you have any questions or require assistance, our support team is always here to help.</p>

          <p style="margin-top: 30px;">Welcome aboard, and happy learning!</p>

          <p>Warm regards,<br>
          <strong>Student Success Team</strong><br>
          Trizen Ventures LLP</p>

          <hr style="margin-top: 30px;">
          <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Enrollment approval email sent successfully');
  } catch (error) {
    console.error('Error sending enrollment approval email:', error);
    // Do not throw error to avoid interrupting the approval process
  }
};


// Authentication Routes
// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send response with role information
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user' // Include role information
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user data
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile settings
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, displayName, bio, email, timezone } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If email is being changed, check if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    
    if (name) user.name = name;
    if (displayName) user.displayName = displayName;
    if (bio) user.bio = bio;
    if (timezone) user.timezone = timezone;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        timezone: user.timezone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user password
app.put('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user notification preferences
app.put('/api/user/notifications', authenticateToken, async (req, res) => {
  try {
    const { courseUpdates, assignmentReminders, discussionReplies } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update notification preferences
    user.notificationPreferences = {
      courseUpdates,
      assignmentReminders,
      discussionReplies
    };
    
    await user.save();
    
    res.json({
      message: 'Notification preferences updated successfully',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's connected devices
app.get('/api/user/devices', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.connectedDevices || []);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove connected device
app.delete('/api/user/devices/:deviceId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.connectedDevices = user.connectedDevices.filter(
      device => device.id !== req.params.deviceId
    );
    
    await user.save();
    
    res.json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Course Routes

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().select('-__v');
    
    // If user is authenticated, check enrollment status for each course
    const token = req.headers.authorization?.split(' ')[1];
    let userId;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Invalid token, but we'll still return courses without enrollment info
      }
    }
    
    if (userId) {
      // Get all enrollments for this user
      const enrollments = await UserCourse.find({ userId });
      const enrollmentMap = {};
      
      enrollments.forEach(enrollment => {
        enrollmentMap[enrollment.courseId.toString()] = {
          status: enrollment.status,
          progress: enrollment.progress
        };
      });
      
      // Add enrollment status to each course
      const coursesWithEnrollment = courses.map(course => {
        const courseObj = course.toObject();
        const enrollment = enrollmentMap[course._id.toString()];
        
        if (enrollment) {
          courseObj.enrollmentStatus = enrollment.status;
          courseObj.progress = enrollment.progress;
        }
        
        return courseObj;
      });
      
      res.json(coursesWithEnrollment);
    } else {
      res.json(courses);
    }
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('-__v');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // If user is authenticated, check enrollment status
    const token = req.headers.authorization?.split(' ')[1];
    let enrollmentStatus = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        
        // Check if user is enrolled in this course
        const enrollment = await UserCourse.findOne({
          userId,
          courseId: req.params.id
        });
        
        if (enrollment) {
          enrollmentStatus = {
            status: enrollment.status,
            progress: enrollment.progress
          };
        }
      } catch (err) {
        // Invalid token, but we'll still return the course
      }
    }
    
    // Add enrollment status to course
    const courseObj = course.toObject();
    if (enrollmentStatus) {
      courseObj.enrollmentStatus = enrollmentStatus.status;
      courseObj.progress = enrollmentStatus.progress;
    }
    
    res.json(courseObj);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enrollment Routes

// Enroll in a course
app.post('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create new enrollment
    const enrollment = new UserCourse({
      userId: req.user.id,
      courseId,
      status: 'enrolled'
    });
    
    await enrollment.save();
    
    // Increment student count
    course.students += 1;
    await course.save();
    
    res.status(201).json({ 
      message: 'Successfully enrolled',
      enrollment
    });
    
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's enrolled courses
app.get('/api/my-courses', authenticateToken, async (req, res) => {
  try {
    const enrollments = await UserCourse.find({ userId: req.user.id });
    
    // Get full course details for each enrollment
    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    const enrolledCourses = await Course.find({
      '_id': { $in: courseIds }
    });
    
    // Add progress information to each course
    const coursesWithProgress = enrolledCourses.map(course => {
      const enrollment = enrollments.find(e => 
        e.courseId.toString() === course._id.toString()
      );
      
      return {
        ...course.toObject(),
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        lastAccessedAt: enrollment.lastAccessedAt
      };
    });
    
    res.json(coursesWithProgress);
    
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course progress and status
app.put('/api/my-courses/:courseId/progress', authenticateToken, async (req, res) => {
  try {
    const { progress, status } = req.body;
    const { courseId } = req.params;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }
    
    // Find the user enrollment
    const enrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update enrollment progress
    enrollment.progress = progress;
    
    // Update status if provided
    if (status) {
      enrollment.status = status;
    } else {
      // Automatically determine status based on progress if not explicitly provided
      if (progress === 100) {
        enrollment.status = 'completed';
      } else if (progress > 0) {
        enrollment.status = 'started';
      }
    }
    
    // Always update the last accessed timestamp
    enrollment.lastAccessedAt = new Date();
    
    await enrollment.save();
    
    // Return the updated enrollment data
    res.json({
      message: 'Progress updated successfully',
      enrollment: {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt
      }
    });
    
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enrollment Requests Routes

// Submit enrollment request
app.post('/api/enrollment-requests', authenticateToken, upload.single('transactionScreenshot'), async (req, res) => {
  try {
    const { email, mobile, utrNumber, courseName, courseId } = req.body;
    
    if (!email || !mobile || !utrNumber || !courseName || !courseId || !req.file) {
      return res.status(400).json({ message: 'All fields and file are required' });
    }
    
    const enrollmentRequest = new EnrollmentRequest({
      userId: req.user.id,
      courseId,
      email,
      mobile,
      courseName,
      utrNumber,
      transactionScreenshot: `/uploads/${req.file.filename}`,
      status: 'pending',
    });
    
    await enrollmentRequest.save();
    
    // Mark course as pending in UserCourse collection (if not already enrolled)
    const existingEnrollment = await UserCourse.findOne({ 
      userId: req.user.id,
      courseId
    });
    
    if (!existingEnrollment) {
      const enrollment = new UserCourse({
        userId: req.user.id,
        courseId,
        status: 'pending',
        progress: 0
      });
      
      await enrollment.save();
    } else if (existingEnrollment.status !== 'enrolled' && 
              existingEnrollment.status !== 'started' && 
              existingEnrollment.status !== 'completed') {
      existingEnrollment.status = 'pending';
      await existingEnrollment.save();
    }
    
    res.status(201).json({ 
      message: 'Enrollment request submitted successfully',
      enrollmentRequest
    });
    
  } catch (error) {
    console.error('Enrollment request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all enrollment requests
app.get('/api/admin/enrollment-requests', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const enrollmentRequests = await EnrollmentRequest.find().sort({ createdAt: -1 });
    res.json(enrollmentRequests);
  } catch (error) {
    console.error('Get enrollment requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Replace the existing approval endpoint with this updated version
app.put('/api/admin/enrollment-requests/:id/approve', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const enrollmentRequest = await EnrollmentRequest.findById(req.params.id)
      .populate('userId', 'email')
      .populate('courseId', 'title');
    
    if (!enrollmentRequest) {
      return res.status(404).json({ message: 'Enrollment request not found' });
    }
    
    // Update request status
    enrollmentRequest.status = 'approved';
    await enrollmentRequest.save();
    
    // Update user course enrollment
    const existingEnrollment = await UserCourse.findOne({ 
      userId: enrollmentRequest.userId._id,
      courseId: enrollmentRequest.courseId._id
    });
    
    if (existingEnrollment) {
      existingEnrollment.status = 'enrolled';
      await existingEnrollment.save();
    } else {
      const enrollment = new UserCourse({
        userId: enrollmentRequest.userId._id,
        courseId: enrollmentRequest.courseId._id,
        status: 'enrolled',
        progress: 0
      });
      
      await enrollment.save();
    }
    
    // Increment student count in course
    const course = await Course.findById(enrollmentRequest.courseId._id);
    if (course) {
      course.students += 1;
      await course.save();
    }

    // Send approval email
    await sendEnrollmentApprovalEmail(enrollmentRequest);
    
    res.json({ 
      message: 'Enrollment request approved and notification email sent',
      enrollmentRequest
    });
    
  } catch (error) {
    console.error('Approve enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Reject enrollment request
app.put('/api/admin/enrollment-requests/:id/reject', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const enrollmentRequest = await EnrollmentRequest.findById(req.params.id);
    
    if (!enrollmentRequest) {
      return res.status(404).json({ message: 'Enrollment request not found' });
    }
    
    // Update request status
    enrollmentRequest.status = 'rejected';
    await enrollmentRequest.save();
    
    // Update user course enrollment status if it's pending
    const existingEnrollment = await UserCourse.findOne({ 
      userId: enrollmentRequest.userId,
      courseId: enrollmentRequest.courseId,
      status: 'pending'
    });
    
    if (existingEnrollment) {
      // Remove the enrollment record if it was pending
      await UserCourse.deleteOne({ _id: existingEnrollment._id });
    }
    
    res.json({ 
      message: 'Enrollment request rejected',
      enrollmentRequest
    });
    
  } catch (error) {
    console.error('Reject enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact Request Routes

// Submit contact request
app.post('/api/contact-requests', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const contactRequest = new ContactRequest({
      name,
      email,
      subject,
      message,
      status: 'new'
    });
    
    await contactRequest.save();
    
    res.status(201).json({ 
      message: 'Contact request submitted successfully',
      contactRequest
    });
    
  } catch (error) {
    console.error('Contact request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all contact requests
app.get('/api/admin/contact-requests', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const contactRequests = await ContactRequest.find().sort({ createdAt: -1 });
    res.json(contactRequests);
  } catch (error) {
    console.error('Get contact requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update contact request status
app.put('/api/admin/contact-requests/:id/status', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const contactRequest = await ContactRequest.findById(req.params.id);
    
    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }
    
    contactRequest.status = status;
    await contactRequest.save();
    
    res.json({ 
      message: 'Contact request status updated',
      contactRequest
    });
    
  } catch (error) {
    console.error('Update contact request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Discussion Routes

// Get discussions for a course
app.get('/api/courses/:courseId/discussions', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is enrolled in the course
    const enrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId,
      status: { $in: ['enrolled', 'started', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to view discussions' });
    }

    // Get discussions with user and course info
    const discussions = await Discussion.find({ courseId })
      .populate('userId', 'name displayName')
      .populate('replies.userId', 'name displayName')
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new discussion
app.post('/api/courses/:courseId/discussions', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, tags } = req.body;

    // Check if user is enrolled in the course
    const enrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId,
      status: { $in: ['enrolled', 'started', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to create discussions' });
    }

    const discussion = new Discussion({
      courseId,
      userId: req.user.id,
      title,
      content,
      tags
    });

    await discussion.save();

    // Populate user info before sending response
    await discussion.populate('userId', 'name displayName');

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to discussion
app.post('/api/discussions/:discussionId/replies', authenticateToken, async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId: discussion.courseId,
      status: { $in: ['enrolled', 'started', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to reply' });
    }

    discussion.replies.push({
      userId: req.user.id,
      content
    });

    await discussion.save();
    await discussion.populate('replies.userId', 'name displayName');

    res.status(201).json(discussion.replies[discussion.replies.length - 1]);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like on discussion
app.post('/api/discussions/:discussionId/like', authenticateToken, async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await UserCourse.findOne({
      userId: req.user.id,
      courseId: discussion.courseId,
      status: { $in: ['enrolled', 'started', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to like discussions' });
    }

    const userLikeIndex = discussion.likes.indexOf(req.user.id);
    if (userLikeIndex === -1) {
      discussion.likes.push(req.user.id);
    } else {
      discussion.likes.splice(userLikeIndex, 1);
    }

    await discussion.save();
    res.json({ likes: discussion.likes.length });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete discussion
app.delete('/api/discussions/:discussionId', authenticateToken, async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }

    await Discussion.deleteOne({ _id: discussionId });
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
