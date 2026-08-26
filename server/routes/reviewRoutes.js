const express = require("express");
const router = express.Router();
const { createReview, getProductReviews, updateReview, deleteReview, getMyReviewForProduct } = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/auth");

router.get("/product/:productId", getProductReviews);
router.post("/", authenticateUser, createReview);
router.get("/my-review/:productId", authenticateUser, getMyReviewForProduct);
router.put("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
