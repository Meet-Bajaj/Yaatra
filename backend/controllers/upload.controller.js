const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const uploadFile = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    statusCode: 201,
    message: "File uploaded successfully",
    data: {
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    },
  });
});

module.exports = {
  uploadFile,
};
