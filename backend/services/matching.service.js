const Driver = require("../models/driver");

const findNearbyDrivers = async (userCoordinates, maxDistanceKm = 5, limit = 10) => {
  const maxDistanceMeters = maxDistanceKm * 1000;

  return Driver.find({
    status: "online",
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: userCoordinates,
        },
        $maxDistance: maxDistanceMeters,
      },
    },
  })
    .populate("userId", "name phone avatarUrl rating")
    .populate("vehicle")
    .limit(limit);
};

module.exports = {
  findNearbyDrivers,
};
