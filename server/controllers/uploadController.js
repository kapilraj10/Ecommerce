const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");

const fileUrl = (req, filename) => `/uploads/${filename}`;

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    sendResponse(res, 200, true, "Image uploaded", {
      url: fileUrl(req, req.file.filename),
      publicId: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(new AppError("No files uploaded", 400));

    const uploaded = req.files.map((f) => ({
      success: true,
      url: fileUrl(req, f.filename),
      publicId: f.filename,
    }));

    sendResponse(res, 200, true, "Images uploaded", uploaded);
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return next(new AppError("publicId is required", 400));

    const filePath = path.join(uploadsDir, path.basename(publicId));
    if (!fs.existsSync(filePath)) {
      return next(new AppError("Image not found", 404));
    }

    await fs.promises.unlink(filePath);
    sendResponse(res, 200, true, "Image deleted");
  } catch (error) {
    next(error);
  }
};