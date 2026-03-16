const Rating = require("../models/rating");

const createRating = async (req, res, next) => {
  try {
    const { userId, driverId, rating, comment, tripId, bookingId } = req.body;

    if (!userId || !driverId || !rating) {
      return res.status(400).json({ success: false, message: "userId, driverId, and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const newRating = await Rating.create({
      user: userId,
      driver: driverId,
      rating,
      comment,
      trip: tripId,
      booking: bookingId,
    });

    res.status(201).json({ success: true, message: "Rating created successfully", data: newRating });
  } catch (error) {
    next(error);
  }
};

const getRatings = async (req, res, next) => {
  try {
    const { id: driverId } = req.params; // driverId
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ driver: driverId })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "name avatarUrl");

    const totalCount = await Rating.countDocuments({ driver: driverId });

    res.status(200).json({ 
      success: true, 
      count: ratings.length, 
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      data: ratings 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRating,
  getRatings,
};
