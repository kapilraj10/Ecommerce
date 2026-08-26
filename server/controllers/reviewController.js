const Review = require("../models/Review");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment } = req.body;

    if (!product || !rating || !comment) {
      return next(new AppError("Product, rating, and comment are required", 400));
    }

    const existing = await Review.findOne({ user: req.user._id, product });
    if (existing) {
      return next(new AppError("You have already reviewed this product", 400));
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      title,
      comment,
    });

    await review.populate("user", "name");

    sendResponse(res, 201, true, "Review created", review);
  } catch (error) {
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const total = await Review.countDocuments({ product: req.params.productId });
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    sendResponse(res, 200, true, "Reviews fetched", {
      reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found", 404));

    if (review.user.toString() !== req.user._id.toString()) {
      return next(new AppError("Not authorized", 403));
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate("user", "name");

    sendResponse(res, 200, true, "Review updated", review);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found", 404));

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("Not authorized", 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, true, "Review deleted");
  } catch (error) {
    next(error);
  }
};

exports.getMyReviewForProduct = async (req, res, next) => {
  try {
    const review = await Review.findOne({ user: req.user._id, product: req.params.productId });
    sendResponse(res, 200, true, "Review fetched", review || null);
  } catch (error) {
    next(error);
  }
};
