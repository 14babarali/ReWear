const express = require('express');
const Stripe = require('stripe');
const authmiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Initialize Stripe with your secret key
const stripe = Stripe('sk_test_51Q9WsgRxZvryBcMfI61DI2hm2gPBVl58BPhm0EwjAswq2uLeWUVqTb0Kl7UPhZF4w7Mb91ZIp5s4UxjQLbR60GYN00tcKuv8NO'); // Use your secret key from the Stripe Dashboard


router.post('/card-payment', authmiddleware.verifyToken, async (req, res) => {
    const { amount, currency } = req.body;
    // const userId = req.user.id;
  console.log("payment data", amount, currency);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100,
        currency: currency || 'PKR',
      });

      res.json({ clientSecret: paymentIntent.client_secret });
      console.log(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
