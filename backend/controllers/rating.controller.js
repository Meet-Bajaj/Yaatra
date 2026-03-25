const Driver = require("../models/driver");
const Rating = require("../models/rating");
const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const createRating = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.body.driverId);
  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  const rating = await Rating.create({
    user: req.user._id,
    driver: req.body.driverId,
    rating: Number(req.body.rating),
    comment: req.body.comment,
    trip: req.body.tripId || null,
    booking: req.body.bookingId || null,
  });

  const [stats] = await Rating.aggregate([
    { $match: { driver: rating.driver } },
    {
      $group: {
        _id: "$driver",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats) {
    await User.findByIdAndUpdate(driver.userId, {
      rating: Number(stats.averageRating.toFixed(1)),
    });
  }

  sendSuccess(res, {
    statusCode: 201,
    message: "Rating created successfully",
    data: rating,
  });
});

const getRatings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [ratings, totalCount] = await Promise.all([
    Rating.find({ driver: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatarUrl"),
    Rating.countDocuments({ driver: req.params.id }),
  ]);

  sendSuccess(res, {
    data: ratings,
    meta: {
      count: ratings.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    },
  });
});

module.exports = {
  createRating,
  getRatings,
};
