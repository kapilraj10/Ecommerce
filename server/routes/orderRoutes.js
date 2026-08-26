const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrder } = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/auth");

router.use(authenticateUser);
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrder);

module.exports = router;
