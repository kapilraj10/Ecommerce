const express = require("express");
const router = express.Router();
const { validateCoupon, applyCoupon, createCoupon, getCoupons, updateCoupon, deleteCoupon } = require("../controllers/couponController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/validate", authenticateUser, validateCoupon);
router.post("/apply", authenticateUser, applyCoupon);

router.use(authenticateUser, authorizeRoles("admin"));
router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
