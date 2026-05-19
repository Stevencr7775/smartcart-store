const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create-payment-intent', protect, async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const { totalPrice } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100), 
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
