// routes/payment.js
const express = require("express");
const router = express.Router();
const controllerPayment = require("../controllers/payment.js")

router.post("/create-order", controllerPayment.createOrder);

module.exports = router;
