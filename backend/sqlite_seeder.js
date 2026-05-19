const { sequelize, Product, Admin } = require('./models');
const bcrypt = require('bcryptjs');
const products = require('./products.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('SQLite synced & tables completely dropped for fresh seed');

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
            price: p.price,
            description: p.description || '',
            imageUrl: p.imageUrl || '',
            brand: p.brand || 'Generic',
            countInStock: 100, // Set to 100 as requested
            specifications: p.specifications || {}
        }));
        await Product.bulkCreate(formattedProducts);
        console.log(`Successfully seeded ${formattedProducts.length} real-world products into SQLite with 100 stocks each`);

        process.exit();
    } catch (error) {
        console.error('Failed to seed SQLite Database:', error);
        process.exit(1);
    }
}

seedDatabase();
