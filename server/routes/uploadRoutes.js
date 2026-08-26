const express = require("express");
const router = express.Router();
const upload = require("../services/upload");
const { uploadImage, uploadMultiple, deleteImage } = require("../controllers/uploadController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.use(authenticateUser, authorizeRoles("admin"));
router.post("/image", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultiple);
router.delete("/", deleteImage);

module.exports = router;
