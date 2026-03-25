const express = require("express");

const adminController = require("../controllers/admin.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative API routes
 */

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics
 */
router.get("/stats", protect, authorize("admin"), adminController.adminStats);

module.exports = router;
