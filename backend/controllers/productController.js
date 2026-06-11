const { Product } = require('../models');

const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sortBy } = req.query;
    let query = {};
    
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'newest') sort.createdAt = -1;
    else if (sortBy === 'relevance') { /* default mongo order, no explicit sort */ }

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProducts, getProductById };