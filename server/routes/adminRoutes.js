const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  adminGetAllProducts,
} = require("../controllers/adminController");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { createCategory, updateCategory, deleteCategory, reorderCategories } = require("../controllers/categoryController");
const {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  toggleBanner,
} = require("../controllers/heroBannerController");
const {
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

router.use(authenticateUser);
router.use(authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);

router.get("/products", adminGetAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/categories", createCategory);
router.put("/categories/reorder", reorderCategories);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/hero-banners", getAllBanners);
router.post("/hero-banners", createBanner);
router.put("/hero-banners/reorder", reorderBanners);
router.put("/hero-banners/:id", updateBanner);
router.put("/hero-banners/:id/toggle", toggleBanner);
router.delete("/hero-banners/:id", deleteBanner);

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/payment-status", updatePaymentStatus);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContactById);
router.put("/contacts/:id", updateContactStatus);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
