const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addReview);
router.route('/:productId').get(getProductReviews);

module.exports = router;
