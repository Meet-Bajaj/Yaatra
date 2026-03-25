const calculateDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const earthRadiusKm = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const calculateEstimatedFare = (distance, vehicleType = "RICKSHAW") => {
  const baseFare = vehicleType === "CAR" ? 50 : 30;
  const perKmRate = vehicleType === "CAR" ? 15 : 10;
  return Math.round(baseFare + distance * perKmRate);
};

module.exports = {
  calculateDistance,
  calculateEstimatedFare,
};
