const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    totalPrice: { type: Number },
    shippingAddress: { type: String },
    paymentMethod: { type: String },
    taxPrice: { type: Number },
    shippingPrice: { type: Number },
    status: { type: String, default: 'Pending' },
    stripeSessionId: { type: String },
    items: [orderItemSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Order', orderSchema);
