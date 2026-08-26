const cloudinaryService = require("../services/cloudinaryService");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const fs = require("fs");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    const result = await cloudinaryService.uploadImage(req.file.path);

    fs.unlink(req.file.path, () => {});

    if (!result.success) return next(new AppError(result.message, 400));

    sendResponse(res, 200, true, "Image uploaded", { url: result.url, publicId: result.publicId });
  } catch (error) {
    next(error);
  }
};

exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(new AppError("No files uploaded", 400));

    const results = await cloudinaryService.uploadMultiple(req.files);

    req.files.forEach((f) => fs.unlink(f.path, () => {}));

    const uploaded = results.filter((r) => r.success);
    sendResponse(res, 200, true, "Images uploaded", uploaded);
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return next(new AppError("publicId is required", 400));

    const result = await cloudinaryService.deleteImage(publicId);
    if (!result.success) return next(new AppError(result.message, 400));

    sendResponse(res, 200, true, "Image deleted");
  } catch (error) {
    next(error);
  }
};
