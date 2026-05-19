const fs = require('fs');

const generateProducts = () => {
    const electronics = [
        { name: 'iPhone 15 Pro Max 256GB', basePrice: 159900, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop' },
        { name: 'Samsung Galaxy S24 Ultra 512GB', basePrice: 139999, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop' },
        { name: 'Google Pixel 8 Pro', basePrice: 106999, img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop' },
        { name: 'OnePlus 12 5G', basePrice: 69999, img: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=600&h=600&fit=crop' },
        { name: 'Noise-Cancelling Headphones', basePrice: 24999, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop' },
        { name: '4K Smart TV 55"', basePrice: 41990, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop' },
        { name: 'Waterproof Smartwatch', basePrice: 22999, img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop' },
        { name: 'Mechanical Gaming Keyboard', basePrice: 8999, img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop' }
    ];

    const homeDecor = [
        { name: 'Ergonomic Office Chair', basePrice: 14500, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop' },
        { name: 'Hand-Poured Soy Candle', basePrice: 899, img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop' },
        { name: 'Ceramic Pour-Over Coffee Maker', basePrice: 2499, img: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&h=600&fit=crop' },
        { name: 'Minimalist Desk Lamp', basePrice: 1299, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop' }
    ];

    const clothing = [
        { name: 'Organic Cotton Oxford Shirt', basePrice: 1999, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop' },
        { name: 'Handcrafted Leather Weekender Bag', basePrice: 6999, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop' },
        { name: 'Classic Denim Jacket', basePrice: 3499, img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=600&fit=crop' },
        { name: 'Slim Fit Chinos', basePrice: 1899, img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop' }
    ];

    const sports = [
        { name: 'Professional Basketball', basePrice: 2499, img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=600&fit=crop' },
        { name: 'Yoga Mat with Alignment Lines', basePrice: 1499, img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop' },
        { name: 'Adjustable Dumbbell Set', basePrice: 12500, img: 'https://images.unsplash.com/photo-1586714457371-29e2f4165d4b?w=600&h=600&fit=crop' },
        { name: 'Resistance Bands Bundle', basePrice: 899, img: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=600&h=600&fit=crop' }
    ];

    const medicines = [
        { name: 'Luxury Botanical Skincare Set', basePrice: 4500, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop' },
        { name: 'Vitamin C Brightening Serum', basePrice: 850, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop' },
        { name: 'Multivitamin Supplements (60 CT)', basePrice: 950, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop' },
        { name: 'First Aid Kit Complete', basePrice: 1850, img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=600&fit=crop' }
    ];

    const gifts = [
        { name: 'Stainless Steel Water Bottle', basePrice: 950, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop' },
        { name: 'Gourmet Chocolate Gift Box', basePrice: 1599, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop' },
        { name: 'Engraved Metal Pen set', basePrice: 1250, img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&h=600&fit=crop' }
    ];

    const sourceData = {
        'Electronics': electronics,
        'Home Decor': homeDecor,
        'Clothing': clothing,
        'Sports': sports,
        'Medicines': medicines,
        'Gifts': gifts
    };

    let allProducts = [];

    for (const [category, items] of Object.entries(sourceData)) {
        items.forEach((item, index) => {
            allProducts.push({
                name: item.name,
                description: `High quality ${item.name.toLowerCase()} for your everyday needs. Highly recommended by experts.`,
                price: item.basePrice,
                category: category,
                imageUrl: item.img,
                countInStock: Math.floor(Math.random() * 100) + 10,
                rating: Number((Math.random() * 1 + 4).toFixed(1)),
                numReviews: Math.floor(Math.random() * 500) + 20
            });
            allProducts.push({
                name: `Premium ${item.name}`,
                description: `The premium version of our ${item.name.toLowerCase()}. Enhanced materials, superior durability.`,
                price: Math.floor(item.basePrice * 1.4),
                category: category,
                imageUrl: item.img.replace('?w=600', '?w=601'),
                countInStock: Math.floor(Math.random() * 50) + 5,
                rating: Number((Math.random() * 0.5 + 4.5).toFixed(1)),
                numReviews: Math.floor(Math.random() * 200) + 10
            });
        });
    }

    console.log(`Generated ${allProducts.length} unique products properties.`);

    let template = fs.readFileSync('seeder.js', 'utf8');
    const startIndex = template.indexOf('const products = [');
    const endIndex = template.indexOf('];', startIndex) + 2;

    if (startIndex !== -1 && endIndex !== -1) {
        const productString = `const products = ${JSON.stringify(allProducts, null, 4)};`;
        template = template.substring(0, startIndex) + productString + template.substring(endIndex);
        fs.writeFileSync('seeder.js', template);
        console.log('Successfully wrote products to seeder.js');
    } else {
        console.error('Could not find products array in seeder.js');
        process.exit(1);
    }
};

generateProducts();
