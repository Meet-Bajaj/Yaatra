const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const crypto = require("crypto");

// Setup Multer internally memory storage so we can stream to S3
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "MOCK_ACCESS_KEY",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "MOCK_SECRET_KEY",
  },
});

const uploadToS3 = async (fileBuffer, originalName, mimeType) => {
  const fileExtension = path.extname(originalName);
  const randomName = crypto.randomBytes(16).toString("hex");
  const fileName = `${randomName}${fileExtension}`;

  const bucketName = process.env.AWS_S3_BUCKET || "rikride-kyc";

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_S3_REGION || "ap-south-1"}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
};

module.exports = {
  upload,
  uploadToS3,
};
