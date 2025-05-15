
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

// Check for required MinIO environment variables
const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 443;
const minioUseSSL = process.env.MINIO_USE_SSL === 'true';
const minioAccessKey = process.env.MINIO_ACCESS_KEY;
const minioSecretKey = process.env.MINIO_SECRET_KEY;
const minioBucketName = process.env.MINIO_BUCKET_NAME || 'videos';

// Validate MinIO configuration
if (!minioEndpoint || !minioAccessKey || !minioSecretKey) {
  console.error('Missing required MinIO environment variables:');
  console.error(`MINIO_ENDPOINT: ${minioEndpoint ? 'Set' : 'Missing'}`);
  console.error(`MINIO_ACCESS_KEY: ${minioAccessKey ? 'Set' : 'Missing'}`);
  console.error(`MINIO_SECRET_KEY: ${minioSecretKey ? 'Set' : 'Missing'}`);
  console.error(`MINIO_BUCKET_NAME: ${minioBucketName ? 'Set' : 'Missing'}`);
}

// Initialize MinIO client with better error handling
let minioClient;
try {
  if (minioEndpoint && minioAccessKey && minioSecretKey) {
    minioClient = new Minio.Client({
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey
    });
    console.log(`MinIO client initialized with endpoint: ${minioEndpoint}`);
  } else {
    console.error('MinIO client initialization skipped due to missing environment variables');
  }
} catch (err) {
  console.error('Error initializing MinIO client:', err);
}

// Make sure the bucket exists (this would normally be done at server startup)
async function ensureBucketExists() {
  try {
    if (!minioClient) {
      console.error('Cannot check bucket existence: MinIO client not initialized');
      return;
    }
    
    const bucketExists = await minioClient.bucketExists(minioBucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(minioBucketName);
      console.log(`Created bucket ${minioBucketName}`);
    }
  } catch (err) {
    console.error('Error checking/creating bucket:', err);
  }
}

// Only run if MinIO client was initialized
if (minioClient) {
  ensureBucketExists();
}

// Fallback function for video storage when MinIO is unavailable
const storeVideoLocally = (file) => {
  const localPath = `/uploads/videos/${file.filename}`;
  return {
    url: localPath,
    filename: file.filename
  };
};

// Route for video upload (accessible by instructors)
router.post('/videos/upload', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Get the uploaded file details
    const { filename, path: filePath, originalname } = req.file;
    
    // Check if MinIO client is available
    if (!minioClient) {
      console.warn('MinIO client not available, storing video locally');
      const result = storeVideoLocally(req.file);
      return res.status(200).json({
        message: 'Video uploaded successfully (local storage)',
        videoUrl: result.url,
        filename: result.filename
      });
    }
    
    // Determine the object name in MinIO bucket (videos/filename)
    const objectName = `videos/${filename}`;
    
    console.log(`Uploading ${filePath} to MinIO bucket ${minioBucketName} as ${objectName}`);
    
    try {
      // Upload file to MinIO
      await minioClient.fPutObject(
        minioBucketName,
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
    } catch (uploadError) {
      console.error('MinIO upload error:', uploadError);
      // Fallback to local storage if MinIO upload fails
      const result = storeVideoLocally(req.file);
      return res.status(200).json({
        message: 'Video uploaded to local storage (MinIO upload failed)',
        videoUrl: result.url,
        filename: result.filename
      });
    }
  } catch (error) {
    console.error('Video upload error:', error);
    return res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
});

// Route to serve videos from MinIO
router.get('/videos/:filename', async (req, res) => {
  const { filename } = req.params;
  const objectName = `videos/${filename}`;
  
  // Check if MinIO client is available
  if (!minioClient) {
    console.warn('MinIO client not available, serving video from local storage');
    const localPath = path.join(__dirname, '../uploads/videos', filename);
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }
    return res.status(404).json({ message: 'Video not found' });
  }
  
  try {
    // Check if object exists in MinIO
    let statObject;
    try {
      statObject = await minioClient.statObject(minioBucketName, objectName);
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
        minioBucketName,
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
      
      const stream = await minioClient.getObject(minioBucketName, objectName);
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ message: 'Error streaming video', error: error.message });
  }
});

module.exports = router;
