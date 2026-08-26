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
const { createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.use(authenticateUser);
router.use(authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);

router.get("/products", adminGetAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/payment-status", updatePaymentStatus);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
