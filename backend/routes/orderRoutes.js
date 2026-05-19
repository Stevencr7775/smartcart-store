const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrderById,
    updateOrderStatus 
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, addOrderItems);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, updateOrderStatus); // Should be admin check too, but for now protect is fine

module.exports = router;
