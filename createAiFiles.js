const fs = require('fs');
const path = require('path');

const files = {
  'backend/controllers/aiController.js': `const Product = require('../models/Product');
// @desc    Get AI personalized recommendations
// @route   GET /api/ai/recommendations
// @access  Public (should be Private in prod to use user history)
const getRecommendations = async (req, res) => {
  try {
    // Mocking an AI response by randomly picking products
    const count = await Product.countDocuments();
    const random = Math.floor(Math.random() * count);
    const recommendations = await Product.find().skip(random).limit(4);
    
    res.json({
      message: 'These products were curated by SmartCart AI based on your recent activity.',
      data: recommendations
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get AI smart search suggestions
// @route   GET /api/ai/search-suggestions?q=...
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const query = req.query.q;
    // Mock smart search logic finding partial matches
    const suggestions = await Product.find({ name: { $regex: query, $options: 'i' } }).limit(5);
    res.json({
      intent: 'purchase',
      suggestions: suggestions
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get Trending Products (AI Detected)
// @route   GET /api/ai/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const trending = await Product.find({ isTrending: true }).limit(6);
    res.json({ data: trending });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getRecommendations, getSearchSuggestions, getTrendingProducts };`,
  'backend/routes/aiRoutes.js': `const express = require('express');
const router = express.Router();
const { getRecommendations, getSearchSuggestions, getTrendingProducts } = require('../controllers/aiController');

router.route('/recommendations').get(getRecommendations);
router.route('/search-suggestions').get(getSearchSuggestions);
router.route('/trending').get(getTrendingProducts);

module.exports = router;`,
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + filePath);
}
