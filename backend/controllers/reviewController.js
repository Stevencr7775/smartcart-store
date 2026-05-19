const { Review, User } = require('../models');

const addReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const review = await Review.create({
            rating,
            comment,
            productId,
            userId: req.user.id
        });
        res.status(201).json(review);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
        res.status(200).json(reviews);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { addReview, getProductReviews };