const Driver = require("../models/driver");

const findNearbyDrivers = async (userCoordinates, maxDistanceKm = 5, limit = 10) => {
  try {
    const maxDistanceMeters = maxDistanceKm * 1000;

    const nearbyDrivers = await Driver.find({
      status: "online",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userCoordinates, // [longitude, latitude]
          },
          $maxDistance: maxDistanceMeters,
        },
      },
    })
      .populate("userId", "name phone avatarUrl rating")
      .populate("vehicle")
      .limit(limit);

    return nearbyDrivers;
  } catch (error) {
    console.error("Matching Service Error:", error);
    throw new Error("Failed to find nearby drivers");
  }
};

module.exports = {
  findNearbyDrivers,
};
