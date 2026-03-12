const createRating = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Create rating route" });
  } catch (error) {
    next(error);
  }
};

const getRatings = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get ratings route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRating,
  getRatings,
};
