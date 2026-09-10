const express = require("express");
const router = express.Router();
const { getActiveBanners } = require("../controllers/heroBannerController");

router.get("/", getActiveBanners);

module.exports = router;
