
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const Minio = require('minio');

// Create uploads directory for temporary storage
const uploadsDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage for temporary files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `video-${uniqueId}${fileExtension}`);
  }
});

// File filter to accept only mp4 videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Only MP4 videos are allowed'), false);
  }
};

// Configure upload limits (100MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: fileFilter
});

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// Make sure the bucket exists (this would normally be done at server startup)
async function ensureBucketExists() {
  try {
    const bucketExists = await minioClient.bucketExists(process.env.MINIO_BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(process.env.MINIO_BUCKET_NAME);
      console.log(`Created bucket ${process.env.MINIO_BUCKET_NAME}`);
    }
  } catch (err) {
    console.error('Error checking/creating bucket:', err);
  }
}

ensureBucketExists();

// Route for video upload by instructors
router.post('/instructor/videos/upload', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Get the uploaded file details
    const { filename, path: filePath, originalname } = req.file;
    
    // Determine the object name in MinIO bucket (videos/filename)
    const objectName = `videos/${filename}`;
    
    console.log(`Uploading ${filePath} to MinIO bucket ${process.env.MINIO_BUCKET_NAME} as ${objectName}`);
    
    // Upload file to MinIO
    await minioClient.fPutObject(
      process.env.MINIO_BUCKET_NAME,
      objectName,
      filePath,
      {
        'Content-Type': 'video/mp4',
        'x-amz-meta-original-filename': originalname
      }
    );
    
    console.log(`Uploaded ${filePath} to MinIO successfully`);
    
    // Generate URL for the uploaded video
    // We'll use a route that will proxy requests to MinIO
    const videoUrl = `/api/videos/${filename}`;
    
    // Optionally delete the temporary file after upload
    fs.unlinkSync(filePath);
    
    // Return the URL to access the video
    return res.status(200).json({
      message: 'Video uploaded successfully',
      videoUrl: videoUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
});

// Route to serve videos from MinIO
router.get('/videos/:filename', async (req, res) => {
  const { filename } = req.params;
  const objectName = `videos/${filename}`;
  
  try {
    // Check if object exists in MinIO
    let statObject;
    try {
      statObject = await minioClient.statObject(process.env.MINIO_BUCKET_NAME, objectName);
    } catch (err) {
      if (err.code === 'NotFound') {
        return res.status(404).json({ message: 'Video not found' });
      }
      throw err;
    }
    
    const fileSize = statObject.size;
    const range = req.headers.range;
    
    // Handle range requests for video streaming
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      
      // Stream the part of the file requested
      const stream = await minioClient.getPartialObject(
        process.env.MINIO_BUCKET_NAME,
        objectName,
        start,
        end
      );
      
      stream.pipe(res);
    } else {
      // Send the whole file if range is not specified
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      
      const stream = await minioClient.getObject(process.env.MINIO_BUCKET_NAME, objectName);
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ message: 'Error streaming video', error: error.message });
  }
});

module.exports = router;
