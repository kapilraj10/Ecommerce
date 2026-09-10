const Category = require("../models/Category");
const Product = require("../models/Product");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, active, order } = req.body;

    if (!name) {
      return next(new AppError("Category name is required", 400));
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return next(new AppError("Category already exists", 400));
    }

    const category = await Category.create({ name, image, active, order });

    sendResponse(res, 201, true, "Category created", category);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const onlyActive = req.query.includeInactive !== "true";
    const filter = onlyActive ? { active: { $ne: false } } : {};

    const [categories, counts] = await Promise.all([
      Category.find(filter).sort({ order: 1, name: 1 }),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const result = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      active: cat.active,
      order: cat.order,
      productCount: countMap[cat._id.toString()] || 0,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    sendResponse(res, 200, true, "Categories fetched", result);
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

    const { name, image, active, order } = req.body;
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (image !== undefined) payload.image = image;
    if (active !== undefined) payload.active = active;
    if (order !== undefined) payload.order = order;

    const updated = await Category.findByIdAndUpdate(req.params.id, payload, {
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

exports.reorderCategories = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return next(new AppError("orderedIds array is required", 400));
    }

    const bulk = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    if (bulk.length > 0) {
      await Category.bulkWrite(bulk);
    }

    const categories = await Category.find().sort({ order: 1, name: 1 });
    sendResponse(res, 200, true, "Categories reordered", categories);
  } catch (error) {
    next(error);
  }
};
