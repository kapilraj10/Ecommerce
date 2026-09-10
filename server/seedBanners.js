const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const HeroBanner = require("./models/HeroBanner");

const banners = [
  {
    badge: "PREMIUM TECH",
    title: "Your Trusted Tech Store",
    description:
      "Explore the latest gadgets, laptops, and accessories at the best prices in Nepal.",
    image: "",
    primaryText: "Shop Now",
    primaryUrl: "/products",
    secondaryText: "View Deals",
    secondaryUrl: "/products",
    offerText: "Up to 30% OFF on selected items",
    active: true,
    order: 0,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected for seeding hero banners...");

    const count = await HeroBanner.countDocuments();
    if (count === 0) {
      await HeroBanner.insertMany(banners);
      console.log(`${banners.length} hero banner(s) seeded successfully.`);
    } else {
      console.log(`Hero banners already exist (${count}). Skipping seed.`);
    }
  } catch (error) {
    console.error("Error seeding hero banners:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
