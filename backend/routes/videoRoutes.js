
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

// Configure MinIO client
const s3Client = new S3Client({
  endpoint: `https://${process.env.MINIO_ENDPOINT}`,
  region: 'us-east-1', // MinIO doesn't require a specific region
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY
  },
  forcePathStyle: true,
  signatureVersion: 'v4'
});

// Configure multer-s3 upload
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.MINIO_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const courseId = req.body.courseId || 'uncategorized';
      const fileName = `videos/${courseId}/${Date.now()}-${path.basename(file.originalname)}`;
      cb(null, fileName);
    }
  }),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

// Route for video upload
router.post('/upload-video', authenticateToken, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.location;
    
    return res.status(200).json({
      message: 'Video uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.key
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
});

// Route to get a list of videos for a course
router.get('/course-videos/:courseId', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const prefix = `videos/${courseId}/`;
    
    const listObjectsCommand = {
      Bucket: process.env.MINIO_BUCKET_NAME,
      Prefix: prefix
    };
    
    const data = await s3Client.send(listObjectsCommand);
    
    const videos = data.Contents ? data.Contents.map(item => {
      return {
        key: item.Key,
        url: `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${item.Key}`,
        lastModified: item.LastModified,
        size: item.Size
      };
    }) : [];
    
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching course videos:', error);
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
});

module.exports = router;
