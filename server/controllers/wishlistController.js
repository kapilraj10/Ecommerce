const Wishlist = require("../models/Wishlist");
const sendResponse = require("../utils/apiResponse");

exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    sendResponse(res, 200, true, "Wishlist fetched", wishlist);
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return next(new AppError("Product ID is required", 400));

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
      return sendResponse(res, 200, true, "Added to wishlist", wishlist);
    }

    const index = wishlist.products.indexOf(productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return sendResponse(res, 200, true, "Removed from wishlist", wishlist);
    }

    wishlist.products.push(productId);
    await wishlist.save();
    sendResponse(res, 200, true, "Added to wishlist", wishlist);
  } catch (error) {
    next(error);
  }
};

exports.isInWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isIn = wishlist ? wishlist.products.includes(req.params.productId) : false;
    sendResponse(res, 200, true, "Checked", { isWishlisted: isIn });
  } catch (error) {
    next(error);
  }
};
