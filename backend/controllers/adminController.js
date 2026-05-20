const { Product, Order, User } = require('../models');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateProduct = async (req, res) => {
    try {
        const { name, category, price, description, imageUrl, brand, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.price = price !== undefined ? Number(price) : product.price;
            product.stock = stock !== undefined ? Number(stock) : product.stock;
            product.description = description || product.description;
            product.imageUrl = imageUrl || product.imageUrl;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAnalytics = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const revenueResult = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const bestSellerResult = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 1 }
        ]);

        let bestSeller = "N/A";
        if (bestSellerResult.length > 0) {
            const product = await Product.findById(bestSellerResult[0]._id);
            if (product) bestSeller = product.name;
        }

        const allTransactions = await Order.find().sort({ createdAt: -1 });

        res.json({
            stats: { totalProducts, totalOrders, totalRevenue, bestSeller },
            transactions: allTransactions,
            insight: `Based on the sales frequency, ${bestSeller} is currently your most demanded product.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate analytics' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, category, price, description, imageUrl, brand, stock } = req.body;
        const product = await Product.create({
            name: name || 'New Product',
            category: category || 'General',
            brand: brand || 'Generic',
            price: price || 0,
            stock: stock !== undefined ? Number(stock) : 100,
            description: description || '',
            imageUrl: imageUrl || ''
        });
        res.status(201).json(product);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'username email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            if (order.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, getAnalytics, getAllOrders, updateOrderStatus };