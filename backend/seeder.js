const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load env vars
dotenv.config();

const products = require('./products.json');

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcart');
        console.log('MongoDB connected for seeding');
        
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = [];
        let admin = new User({ name: 'Admin User', email: 'admin@smartcart.com', password: 'password123', role: 'admin' });
        await admin.save();
        createdUsers.push(admin);

        let standard = new User({ name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' });
        await standard.save();
        createdUsers.push(standard);


        const adminUserId = createdUsers[0]._id;

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUserId };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcart');
        
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
