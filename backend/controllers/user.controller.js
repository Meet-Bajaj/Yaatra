const User = require("../models/users");

const getUserProfile = async (req, res, next) => {
  try {
    // Determine userId from req.user set by authMiddleware (if implemented), or req.query/req.params
    // For now assuming we pass userId in query for testing since middleware is not confirmed applied to route
    const userId = req.user ? req.user.id : req.query.userId;
    
    if (!userId) {
       return res.status(400).json({ success: false, message: "User ID required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    
    if (!userId) {
       return res.status(400).json({ success: false, message: "User ID required" });
    }

    const allowedUpdates = ["name", "email", "avatarUrl"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User profile updated", data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
