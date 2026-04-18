const express = require("express");
const { param } = require("express-validator");

const adminController = require("../controllers/admin.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate } = require("../middlewares/validate");

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

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
	"/users/:id",
	protect,
	authorize("admin"),
	validate([param("id").isMongoId()]),
	adminController.deleteUser
);

module.exports = router;
