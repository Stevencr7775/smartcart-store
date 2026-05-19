const fs = require('fs');
const path = require('path');

const files = {
  'backend/controllers/productController.js': `const Product = require('../models/Product');
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getProducts, getProductById };`,
  'backend/routes/productRoutes.js': `const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');
const router = express.Router();
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
module.exports = router;`,
  'backend/routes/authRoutes.js': `const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
module.exports = router;`,
  'backend/middlewares/authMiddleware.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) { res.status(401).json({ message: 'Not authorized, token failed' }); }
  }
  if (!token) { res.status(401).json({ message: 'Not authorized, no token' }); }
};
module.exports = { protect };`,
  'backend/controllers/orderController.js': `const Order = require('../models/Order');
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { addOrderItems };`,
  'backend/routes/orderRoutes.js': `const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
router.route('/').post(protect, addOrderItems);
module.exports = router;`,
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + filePath);
}
