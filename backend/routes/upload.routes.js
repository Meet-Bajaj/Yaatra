const express = require("express");

const uploadController = require("../controllers/upload.controller");
const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../utils/upload");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload API routes
 */

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post("/", protect, upload.single("file"), uploadController.uploadFile);

module.exports = router;
