const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

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
 *     summary: Get administrative statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin stats route
 */
router.get("/stats", adminController.adminStats);

module.exports = router;
