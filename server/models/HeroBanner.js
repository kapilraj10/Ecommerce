const mongoose = require("mongoose");

const heroBannerSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    image: {
      type: String,
      default: "",
    },
    mobileImage: {
      type: String,
      default: "",
    },
    primaryText: {
      type: String,
      trim: true,
      default: "Shop Now",
      maxlength: 50,
    },
    primaryUrl: {
      type: String,
      trim: true,
      default: "/products",
    },
    secondaryText: {
      type: String,
      trim: true,
      default: "View Deals",
      maxlength: 50,
    },
    secondaryUrl: {
      type: String,
      trim: true,
      default: "/products?search=deal",
    },
    offerText: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

heroBannerSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model("HeroBanner", heroBannerSchema);
