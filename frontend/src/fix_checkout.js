const fs = require('fs');
let content = fs.readFileSync('pages/Checkout.jsx', 'utf8');

// The new SQL Schema only requires: productId, quantity, totalPrice per item
// The original MongoDB was: orderItems: [{name, qty, image, price, product}]
content = content.replace(
`                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400',
                        price: item.price,
                        product: item._id
                    })),
                    shippingAddress: { address: 'Mock Address', city: 'Mock City', postalCode: '12345', country: 'Mock Country'},
                    paymentMethod: 'Stripe',
                    itemsPrice: subtotal,
                    taxPrice: tax,
                    shippingPrice: delivery,
                    totalPrice: total`,
`                    orderItems: cartItems.map(item => ({
                        product: item.id || item._id, // Support old and new ID formats
                        qty: item.qty,
                        price: item.price
                    })),
                    totalPrice: total`
);

fs.writeFileSync('pages/Checkout.jsx', content);
console.log('Checkout updated for SQLite Orders format');
