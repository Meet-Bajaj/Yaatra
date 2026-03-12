const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create", paymentController.createPayment);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
