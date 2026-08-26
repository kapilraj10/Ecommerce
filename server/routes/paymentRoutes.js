const express = require("express");
const router = express.Router();
const { initiateKhaltiPayment, verifyKhaltiPayment } = require("../controllers/paymentController");
const { authenticateUser } = require("../middleware/auth");

router.use(authenticateUser);
router.post("/khalti/initiate", initiateKhaltiPayment);
router.post("/khalti/verify", verifyKhaltiPayment);

module.exports = router;
