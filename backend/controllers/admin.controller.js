const adminStats = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Admin stats route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminStats,
};
