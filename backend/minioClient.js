
const Minio = require('minio');
require('dotenv').config();

// Log environment variables for debugging (remove in production)
console.log('MinIO Configuration:');
console.log(`MINIO_ENDPOINT: ${process.env.MINIO_ENDPOINT || 'localhost'}`);
console.log(`MINIO_PORT: ${process.env.MINIO_PORT || 9000}`);
console.log(`MINIO_USE_SSL: ${process.env.MINIO_USE_SSL === 'true'}`);
console.log(`MINIO_ACCESS_KEY: ${process.env.MINIO_ACCESS_KEY ? 'Set' : 'Missing'}`);
console.log(`MINIO_SECRET_KEY: ${process.env.MINIO_SECRET_KEY ? 'Set' : 'Missing'}`);

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// Add a method to check if MinIO configuration is valid
minioClient.isConfigValid = () => {
  return process.env.MINIO_ENDPOINT && 
         process.env.MINIO_ACCESS_KEY && 
         process.env.MINIO_SECRET_KEY;
};

module.exports = minioClient;
