const Coupon = require("../models/Coupon");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return next(new AppError("Coupon code is required", 400));

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return next(new AppError("Invalid coupon code", 400));

    if (coupon.expiresAt < new Date()) {
      return next(new AppError("Coupon has expired", 400));
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return next(new AppError("Coupon usage limit reached", 400));
    }

    if (subtotal && subtotal < coupon.minPurchase) {
      return next(new AppError(`Minimum purchase of Rs. ${coupon.minPurchase} required`, 400));
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    sendResponse(res, 200, true, "Coupon applied", {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchase, maxDiscount, usageLimit, expiresAt } = req.body;

    if (!code || !discountType || !discountValue || !expiresAt) {
      return next(new AppError("Code, discountType, discountValue, and expiresAt are required", 400));
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return next(new AppError("Coupon code already exists", 400));

    const coupon = await Coupon.create({
      code, discountType, discountValue, minPurchase, maxDiscount, usageLimit, expiresAt,
    });

    sendResponse(res, 201, true, "Coupon created", coupon);
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    sendResponse(res, 200, true, "Coupons fetched", coupons);
  } catch (error) {
    next(error);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return next(new AppError("Coupon not found", 404));
    sendResponse(res, 200, true, "Coupon updated", coupon);
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return next(new AppError("Coupon not found", 404));
    sendResponse(res, 200, true, "Coupon deleted");
  } catch (error) {
    next(error);
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return next(new AppError("Coupon code is required", 400));

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return next(new AppError("Invalid coupon code", 400));

    if (coupon.expiresAt < new Date()) return next(new AppError("Coupon has expired", 400));
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return next(new AppError("Coupon usage limit reached", 400));
    if (subtotal && subtotal < coupon.minPurchase) return next(new AppError(`Minimum purchase of Rs. ${coupon.minPurchase} required`, 400));

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    coupon.usedCount += 1;
    await coupon.save();

    sendResponse(res, 200, true, "Coupon applied", {
      code: coupon.code,
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    next(error);
  }
};
