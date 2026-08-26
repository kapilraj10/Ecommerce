const Category = require("../models/Category");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return next(new AppError("Category name is required", 400));
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return next(new AppError("Category already exists", 400));
    }

    const category = await Category.create({ name, image });

    sendResponse(res, 201, true, "Category created", category);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    sendResponse(res, 200, true, "Categories fetched", categories);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    sendResponse(res, 200, true, "Category updated", updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    await Category.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, true, "Category deleted");
  } catch (error) {
    next(error);
  }
};
