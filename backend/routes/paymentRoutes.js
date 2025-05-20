// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_3sUvwjenYATcp2",
  key_secret: "oxDwfoAGg1dPOjf4ZmExeKJD",
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // in paisa
    currency: "INR",
    receipt: `receipt_order_${Math.random() * 1000}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
