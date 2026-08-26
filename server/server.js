const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api", limiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/passwordResetRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running", timestamp: new Date().toISOString() });
});

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
});

app.use(require("./middleware/errorHandler"));

module.exports = app;

if (process.env.VERCEL !== "1") {
  const http = require("http");
  const server = http.createServer(app);

  try {
    const { Server } = require("socket.io");
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.on("join-product", (productId) => socket.join(`product-${productId}`));
      socket.on("leave-product", (productId) => socket.leave(`product-${productId}`));
      socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
    });
  } catch (e) {
    console.log("Socket.io not available, running without realtime");
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}
