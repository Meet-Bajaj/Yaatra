const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Ensure the directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${fileExtension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadToLocal = async (fileBuffer, originalName, mimeType) => {
  // Provided for compatibility if some services use this method directly
  // However, normally multer middleware handles the upload directly.
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(originalName);
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileName = `${randomName}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error("Local Upload Error:", err);
        return reject(new Error("Failed to upload file locally"));
      }
      resolve(`/uploads/${fileName}`);
    });
  });
};

module.exports = {
  upload,
  uploadToLocal,
};
