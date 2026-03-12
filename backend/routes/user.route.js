const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API routes
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully hit get user profile route
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully hit update user profile route
 */
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);

module.exports = router;
