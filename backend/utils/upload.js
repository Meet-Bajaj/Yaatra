const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const env = require("../config/env");

const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${fileExtension}`);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const upload = multer({
  storage,
  limits: { fileSize: env.uploads.maxFileSize },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP, and PDF files are allowed"));
    }

    return cb(null, true);
  },
});

const uploadToLocal = async (fileBuffer, originalName, mimeType) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(originalName);
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, fileBuffer, (error) => {
      if (error) {
        return reject(new Error("Failed to upload file locally"));
      }

      return resolve({
        path: `/uploads/${fileName}`,
        mimeType,
      });
    });
  });
};

module.exports = {
  upload,
  uploadDir,
  uploadToLocal,
};
