const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Product, Admin } = require('./models');
const products = require('./products.json');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('./database');

const seedData = async () => {
    try {
        await connectDB();
        
        await Product.deleteMany();
        await Admin.deleteMany();
        
        console.log('MongoDB Synced & Collections Dropped');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await Admin.create({
            username: 'admin',
            password: hashedPassword
        });
        console.log('Admin account (admin:admin123) successfully seeded');

        const formattedProducts = products.map(p => ({
            name: p.name,
            category: p.category,
            brand: p.brand,
            price: p.price,
            imageUrl: p.imageUrl,
            description: p.description,
            specifications: p.specifications,
            stock: 100
        }));

        await Product.insertMany(formattedProducts);
        console.log(`Successfully seeded ${formattedProducts.length} real-world products into MongoDB`);

        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();