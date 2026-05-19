const fs = require('fs');
let code = fs.readFileSync('seeder.js', 'utf8');

const newProducts = `const products = [
    {
        name: 'Premium Wireless Noise-Cancelling Headphones',
        description: 'Industry-leading noise cancellation, up to 30 hours of battery life, and crystal-clear sound.',
        price: 24999,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        countInStock: 45,
        rating: 4.8,
        numReviews: 312
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable lumbar support, breathable mesh back, and 3D armrests ensure maximum comfort.',
        price: 14500,
        category: 'Home Decor',
        imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop',
        countInStock: 20,
        rating: 4.6,
        numReviews: 128
    },
    {
        name: '4K Ultra HD Smart TV - 55 inch',
        description: 'Vivid colors, deep blacks, and built-in smart capabilities.',
        price: 41990,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
        countInStock: 15,
        rating: 4.7,
        numReviews: 245
    },
    {
        name: 'Hand-Poured Soy Candle',
        description: 'Lavender and vanilla bean scent, 40-hour burn time, housed in a reusable amber glass jar.',
        price: 899,
        category: 'Home Decor',
        imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop',
        countInStock: 100,
        rating: 4.9,
        numReviews: 86
    },
    {
        name: 'Waterproof Smartwatch',
        description: 'Fitness tracking, heart rate monitoring, and sleep analysis on a vibrant OLED display.',
        price: 22999,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
        countInStock: 60,
        rating: 4.5,
        numReviews: 410
    },
    {
        name: 'Organic Cotton Oxford Shirt',
        description: 'Classic fit, breathable organic cotton, perfect for both casual and formal occasions.',
        price: 1999,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
        countInStock: 120,
        rating: 4.4,
        numReviews: 156
    },
    {
        name: 'Ceramic Pour-Over Coffee Maker',
        description: 'Artisan-crafted ceramic dripper that delivers a clean, smooth cup of coffee every time.',
        price: 2499,
        category: 'Home Decor',
        imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&h=600&fit=crop',
        countInStock: 40,
        rating: 4.8,
        numReviews: 203
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'Customizable RGB backlighting, tactile switches, and aluminum frame for durability and style.',
        price: 8999,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
        countInStock: 35,
        rating: 4.7,
        numReviews: 89
    },
    {
        name: 'Luxury Botanical Skincare Set',
        description: 'Includes a hydrating cleanser, toning mist, and rejuvenating face oil made from natural ingredients.',
        price: 4500,
        category: 'Medicines',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop',
        countInStock: 50,
        rating: 4.9,
        numReviews: 412
    },
    {
        name: 'Handcrafted Leather Weekender Bag',
        description: 'Spacious interior, durable full-grain leather, and brass hardware.',
        price: 6999,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
        countInStock: 15,
        rating: 4.6,
        numReviews: 67
    },
    {
        name: 'Smart Home Hub & Speaker',
        description: 'Control your smart devices, listen to music, and set alarms with just your voice.',
        price: 4499,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop',
        countInStock: 80,
        rating: 4.5,
        numReviews: 320
    },
    {
        name: 'Minimalist Desk Lamp',
        description: 'Sleek metal design with adjustable brightness levels and color temperatures.',
        price: 1299,
        category: 'Home Decor',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
        countInStock: 25,
        rating: 4.7,
        numReviews: 95
    },
    {
        name: 'Modern Accent Chair',
        description: 'Upholstered in soft velvet with mid-century modern wooden legs. A bold statement piece.',
        price: 12500,
        category: 'Home Decor',
        imageUrl: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?w=600&h=600&fit=crop',
        countInStock: 10,
        rating: 4.6,
        numReviews: 42
    },
    {
        name: 'Vitamin C Brightening Serum',
        description: 'Potent antioxidant formula to improve skin texture and reduce dark spots.',
        price: 850,
        category: 'Medicines',
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
        countInStock: 90,
        rating: 4.4,
        numReviews: 180
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-wall vacuum insulated, keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 950,
        category: 'Gifts',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
        countInStock: 150,
        rating: 4.8,
        numReviews: 540
    }
];`;

const startIndex = code.indexOf('const products = [');
const endIndex = code.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + newProducts + code.substring(endIndex);
    fs.writeFileSync('seeder.js', code);
    console.log('Successfully updated seeder.js with INR prices');
} else {
    console.error('Could not find products array');
}
