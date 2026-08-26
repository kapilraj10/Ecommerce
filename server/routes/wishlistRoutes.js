const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist, isInWishlist } = require("../controllers/wishlistController");
const { authenticateUser } = require("../middleware/auth");

router.use(authenticateUser);
router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.get("/check/:productId", isInWishlist);

module.exports = router;
