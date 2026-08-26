const Product = require("../models/Product");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, brand, stock, images } = req.body;

    if (!name || !description || !price || !category) {
      return next(new AppError("Name, description, price, and category are required", 400));
    }

    const product = await Product.create({
      name, description, price, discountPrice, category, brand, stock, images,
    });

    await product.populate("category", "name slug");

    sendResponse(res, 201, true, "Product created", product);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    sendResponse(res, 200, true, "Products fetched", {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    sendResponse(res, 200, true, "Product fetched", product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (req.app.get("io")) {
      req.app.get("io").to(`product-${req.params.id}`).emit("stock-update", {
        productId: req.params.id,
        stock: updated.stock,
      });
    }

    sendResponse(res, 200, true, "Product updated", updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, true, "Product deleted");
  } catch (error) {
    next(error);
  }
};

exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate("category", "name slug");

    sendResponse(res, 200, true, "Related products fetched", related);
  } catch (error) {
    next(error);
  }
};
