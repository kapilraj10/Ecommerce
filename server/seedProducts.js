const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");

const categories = [
  { name: "Laptops", image: "" },
  { name: "Computers", image: "" },
  { name: "Printers", image: "" },
  { name: "Components", image: "" },
  { name: "Accessories", image: "" },
];

const products = [
  {
    name: "ASUS Gaming Laptop Intel Core i7 16GB",
    brand: "ASUS",
    price: 145000,
    discountPrice: 125000,
    stock: 12,
    rating: 4.8,
    numReviews: 124,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],
    description: "High-performance gaming laptop with Intel Core i7, 16GB RAM, 512GB SSD and dedicated RTX GPU. Perfect for gaming and creative workloads.",
    category: "Laptops",
  },
  {
    name: "Logitech Mechanical Keyboard K845",
    brand: "Logitech",
    price: 4200,
    discountPrice: 3499,
    stock: 50,
    rating: 4.6,
    numReviews: 89,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    ],
    description: "Tactile mechanical keyboard with durable switches and sleek aluminium body. Great for typing and gaming.",
    category: "Accessories",
  },
  {
    name: "HP LaserJet Pro Multi-function Printer",
    brand: "HP",
    price: 28000,
    discountPrice: 24999,
    stock: 18,
    rating: 4.4,
    numReviews: 57,
    images: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
    ],
    description: "Reliable multi-function laser printer with print, scan and copy capabilities. Fast and energy efficient.",
    category: "Printers",
  },
  {
    name: "Dell Inspiron Desktop PC Core i5",
    brand: "Dell",
    price: 78000,
    discountPrice: 0,
    stock: 9,
    rating: 4.3,
    numReviews: 41,
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800",
    ],
    description: "Versatile desktop PC for office and home. Powered by Intel Core i5 with 16GB RAM and 512GB SSD.",
    category: "Computers",
  },
  {
    name: "Samsung 27\" QHD Monitor",
    brand: "Samsung",
    price: 42000,
    discountPrice: 38000,
    stock: 15,
    rating: 4.7,
    numReviews: 102,
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800",
    ],
    description: "Crisp 27-inch QHD display with vibrant colors and slim bezels. Ideal for productivity and entertainment.",
    category: "Components",
  },
  {
    name: "Wireless RGB Gaming Mouse",
    brand: "Razer",
    price: 5500,
    discountPrice: 4299,
    stock: 60,
    rating: 4.5,
    numReviews: 76,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    ],
    description: "Ergonomic wireless gaming mouse with customizable RGB lighting and high-precision sensor.",
    category: "Accessories",
  },
  {
    name: "Intel Core i7 14th Gen Processor",
    brand: "Intel",
    price: 52000,
    discountPrice: 0,
    stock: 25,
    rating: 4.9,
    numReviews: 33,
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
    ],
    description: "Latest 14th Gen processor with up to 20 cores. Exceptional performance for demanding applications.",
    category: "Components",
  },
  {
    name: "Canon Inkjet Photo Printer",
    brand: "Canon",
    price: 18500,
    discountPrice: 15999,
    stock: 22,
    rating: 4.2,
    numReviews: 28,
    images: [
      "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=800",
    ],
    description: "Compact inkjet printer delivering sharp text and vivid photo prints for home and small office.",
    category: "Printers",
  },
];

const seedCatalog = async () => {
  try {
    await connectDB();

    const categoryMap = {};
    for (const cat of categories) {
      let doc = await Category.findOne({ name: cat.name });
      if (!doc) {
        doc = new Category(cat);
        await doc.save();
      }
      categoryMap[cat.name] = doc._id;
      console.log(`Category ready: ${cat.name}`);
    }

    let created = 0;
    let skipped = 0;
    for (const prod of products) {
      const existing = await Product.findOne({ name: prod.name });
      if (existing) {
        skipped++;
        continue;
      }
      await Product.create({ ...prod, category: categoryMap[prod.category] });
      created++;
    }

    console.log(`\nSeed complete: ${created} products created, ${skipped} already existed.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedCatalog();
