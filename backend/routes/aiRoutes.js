const express = require('express');
const router = express.Router();
const { chatWithAI, recommendProducts } = require('../controllers/aiController');

// The AI route doesn't necessarily need 'protect' if we want guests to use it, 
// but we could add it if we want it restricted. We will keep it open for now.
router.route('/chat').post(chatWithAI);
router.route('/recommend').post(recommendProducts);

module.exports = router;
