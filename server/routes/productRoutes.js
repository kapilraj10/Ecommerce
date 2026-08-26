const express = require("express");
const router = express.Router();
const { getProducts, getProduct, getRelatedProducts } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/:id/related", getRelatedProducts);

module.exports = router;
