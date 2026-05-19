const { Order, Product, User } = require('../models');
const { sendOrderConfirmation } = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        const formattedItems = orderItems.map(item => ({
            productId: item.id || item.product,
            name: item.name,
            quantity: item.qty,
            image: item.imageUrl || item.image,
            price: item.price
        }));

        const order = await Order.create({
            userId: req.user.id,
            shippingAddress: JSON.stringify(shippingAddress),
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: 'Pending',
            items: formattedItems
        });

        try {
            const targetEmail = req.user.email || req.user.username;
            await sendOrderConfirmation(targetEmail, orderItems, totalPrice);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving order' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'username email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error finding orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            if (order.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating order' });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, updateOrderStatus };