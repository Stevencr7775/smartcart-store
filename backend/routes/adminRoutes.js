const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct, getAnalytics, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect); // All routes require Admin login

router.route('/analytics').get(getAnalytics);
router.route('/orders').get(getAllOrders);
router.route('/orders/:id/status').put(updateOrderStatus);
router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id')
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
