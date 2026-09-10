const HeroBanner = require("../models/HeroBanner");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

const cleanBody = (body) => {
  const allowed = [
    "badge",
    "title",
    "description",
    "image",
    "mobileImage",
    "primaryText",
    "primaryUrl",
    "secondaryText",
    "secondaryUrl",
    "offerText",
    "active",
    "order",
    "startDate",
    "endDate",
  ];
  const payload = {};
  for (const key of allowed) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  return payload;
};

exports.getActiveBanners = async (req, res, next) => {
  try {
    const now = new Date();
    const banners = await HeroBanner.find({
      active: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
      ],
    }).sort({ order: 1, createdAt: 1 });
    sendResponse(res, 200, true, "Hero banners fetched", banners);
  } catch (error) {
    next(error);
  }
};

exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1, createdAt: 1 });
    sendResponse(res, 200, true, "Hero banners fetched", banners);
  } catch (error) {
    next(error);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const body = cleanBody(req.body);
    const banner = await HeroBanner.create(body);
    sendResponse(res, 201, true, "Hero banner created", banner);
  } catch (error) {
    next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return next(new AppError("Hero banner not found", 404));
    }
    const updated = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      cleanBody(req.body),
      { new: true, runValidators: true }
    );
    sendResponse(res, 200, true, "Hero banner updated", updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return next(new AppError("Hero banner not found", 404));
    }
    await HeroBanner.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Hero banner deleted");
  } catch (error) {
    next(error);
  }
};

exports.reorderBanners = async (req, res, next) => {
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
      await HeroBanner.bulkWrite(bulk);
    }

    const banners = await HeroBanner.find().sort({ order: 1, createdAt: 1 });
    sendResponse(res, 200, true, "Hero banners reordered", banners);
  } catch (error) {
    next(error);
  }
};

exports.toggleBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return next(new AppError("Hero banner not found", 404));
    }
    banner.active = !banner.active;
    await banner.save();
    sendResponse(res, 200, true, "Hero banner updated", banner);
  } catch (error) {
    next(error);
  }
};
