const fs = require('fs');

const reliableImages = {
    'Smartphone': [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
    ],
    'Laptop': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop'
    ],
    'Tablet': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop'
    ],
    'Wireless Headphones': [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    'Smartwatch': [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop'
    ],
    '4K TV': ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'],
    'Camera': ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop'],
    'Gaming Console': ['https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=600&fit=crop'],
    'Bluetooth Speaker': ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'],
    'Router': ['https://images.unsplash.com/photo-1560963503-4f9342718cd9?w=600&h=600&fit=crop'],
    
    'Sofa': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop'],
    'Coffee Table': ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=600&fit=crop'],
    'Rug': ['https://images.unsplash.com/photo-1575414003593-ecaee69ccb24?w=600&h=600&fit=crop'],
    'Lamp': ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'],
    'Wall Art': ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop'],
    'Cushion': ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop'],
    'Vase': ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&h=600&fit=crop'],
    'Candle': ['https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop'],
    'Mirror': ['https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=600&h=600&fit=crop'],
    'Plant Pot': ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop'],
    
    'T-Shirt': ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop'],
    'Jeans': ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop'],
    'Jacket': ['https://images.unsplash.com/photo-1551028719-00105ba3c690?w=600&h=600&fit=crop'],
    'Sweater': ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop'],
    'Dress': ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop'],
    'Sneakers': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop'],
    'Formal Shirt': ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop'],
    'Shorts': ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop'],
    'Socks': ['https://images.unsplash.com/photo-1582236528892-99f24259b3bc?w=600&h=600&fit=crop'],
    'Hat': ['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&h=600&fit=crop'],
    
    'Running Shoes': ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop'],
    'Yoga Mat': ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?w=600&h=600&fit=crop'],
    'Dumbbells': ['https://images.unsplash.com/photo-1638202535974-bcdd78887ee4?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop'],
    'Treadmill': ['https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=600&fit=crop'],
    'Tennis Racket': ['https://images.unsplash.com/photo-1622279457486-62dcc4a431a6?w=600&h=600&fit=crop'],
    'Soccer Ball': ['https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600&h=600&fit=crop'],
    'Basketball': ['https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=600&fit=crop'],
    'Resistance Bands': ['https://images.unsplash.com/photo-1598266663439-2056e6900339?w=600&h=600&fit=crop'],
    'Gym Bag': ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'],
    'Water Bottle': ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop'],
    
    'Multivitamins': ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop'],
    'First Aid Kit': ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=600&fit=crop'],
    'Protein Powder': ['https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&h=600&fit=crop'],
    'Pain Reliever': ['https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop'],
    'Cough Syrup': ['https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&h=600&fit=crop'],
    'Bandages': ['https://images.unsplash.com/photo-1631899168128-4ce68972cae0?w=600&h=600&fit=crop'],
    'Thermometer': ['https://images.unsplash.com/photo-1584362917165-526a96857900?w=600&h=600&fit=crop'],
    'Ointment': ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop'],
    'Hand Sanitizer': ['https://images.unsplash.com/photo-1584483766114-2cea6facd077?w=600&h=600&fit=crop'],
    'Face Masks': ['https://images.unsplash.com/photo-1586942425650-dd17b07548b1?w=600&h=600&fit=crop'],
    
    'Perfume': ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop'],
    'Watch': ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop'],
    'Chocolate Box': ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop'],
    'Jewelry Set': ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    'Gift Basket': ['https://images.unsplash.com/photo-1578020190125-f4f7d23f46f5?w=600&h=600&fit=crop'],
    'Wallet': ['https://images.unsplash.com/photo-1627123424574-724758594e9f?w=600&h=600&fit=crop'],
    'Mug': ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop'],
    'Pen Set': ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&h=600&fit=crop'],
    'Photo Frame': ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop'],
    'Flowers': ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=600&fit=crop']
};

const categories = {
  'Electronics': { 
      items: [
          { noun: 'Smartphone', priceRange: [15000, 150000] },
          { noun: 'Laptop', priceRange: [40000, 250000] },
          { noun: 'Tablet', priceRange: [20000, 100000] },
          { noun: 'Wireless Headphones', priceRange: [2000, 35000] },
          { noun: 'Smartwatch', priceRange: [5000, 50000] },
          { noun: '4K TV', priceRange: [30000, 300000] },
          { noun: 'Camera', priceRange: [35000, 200000] },
          { noun: 'Gaming Console', priceRange: [30000, 60000] },
          { noun: 'Bluetooth Speaker', priceRange: [1500, 20000] },
          { noun: 'Router', priceRange: [1500, 15000] }
      ],
      adjectives: ['Smart', 'Wireless', 'Portable', 'Pro', 'Ultra', 'Advanced', 'Premium', 'Next-Gen']
  },
  'Home Decor': { 
      items: [
          { noun: 'Sofa', priceRange: [15000, 100000] },
          { noun: 'Coffee Table', priceRange: [5000, 30000] },
          { noun: 'Rug', priceRange: [2000, 25000] },
          { noun: 'Lamp', priceRange: [1000, 15000] },
          { noun: 'Wall Art', priceRange: [1500, 20000] },
          { noun: 'Cushion', priceRange: [500, 3000] },
          { noun: 'Vase', priceRange: [500, 8000] },
          { noun: 'Candle', priceRange: [300, 2500] },
          { noun: 'Mirror', priceRange: [1500, 15000] },
          { noun: 'Plant Pot', priceRange: [300, 4000] }
      ],
      adjectives: ['Modern', 'Vintage', 'Rustic', 'Minimalist', 'Boho', 'Elegant', 'Cozy', 'Chic']
  },
  'Clothing': { 
      items: [
          { noun: 'T-Shirt', priceRange: [500, 3000] },
          { noun: 'Jeans', priceRange: [1500, 8000] },
          { noun: 'Jacket', priceRange: [2500, 15000] },
          { noun: 'Sweater', priceRange: [1000, 6000] },
          { noun: 'Dress', priceRange: [1500, 12000] },
          { noun: 'Sneakers', priceRange: [2000, 20000] },
          { noun: 'Formal Shirt', priceRange: [1000, 5000] },
          { noun: 'Shorts', priceRange: [600, 3500] },
          { noun: 'Socks', priceRange: [200, 1000] },
          { noun: 'Hat', priceRange: [400, 2500] }
      ],
      adjectives: ['Cotton', 'Denim', 'Leather', 'Casual', 'Formal', 'Athletic', 'Classic', 'Trendy']
  },
  'Sports': { 
      items: [
          { noun: 'Running Shoes', priceRange: [3000, 18000] },
          { noun: 'Yoga Mat', priceRange: [800, 4000] },
          { noun: 'Dumbbells', priceRange: [1500, 8000] },
          { noun: 'Treadmill', priceRange: [25000, 150000] },
          { noun: 'Tennis Racket', priceRange: [2000, 15000] },
          { noun: 'Soccer Ball', priceRange: [800, 5000] },
          { noun: 'Basketball', priceRange: [800, 4000] },
          { noun: 'Resistance Bands', priceRange: [500, 2500] },
          { noun: 'Gym Bag', priceRange: [1000, 6000] },
          { noun: 'Water Bottle', priceRange: [400, 2000] }
      ],
      adjectives: ['Pro', 'Training', 'Fitness', 'Heavy-Duty', 'Lightweight', 'Aerodynamic', 'Premium']
  },
  'Medicines': { 
      items: [
          { noun: 'Multivitamins', priceRange: [500, 2500] },
          { noun: 'First Aid Kit', priceRange: [800, 4000] },
          { noun: 'Protein Powder', priceRange: [2000, 8000] },
          { noun: 'Pain Reliever', priceRange: [100, 1000] },
          { noun: 'Cough Syrup', priceRange: [150, 800] },
          { noun: 'Bandages', priceRange: [100, 500] },
          { noun: 'Thermometer', priceRange: [300, 2000] },
          { noun: 'Ointment', priceRange: [200, 1500] },
          { noun: 'Hand Sanitizer', priceRange: [100, 800] },
          { noun: 'Face Masks', priceRange: [200, 1500] }
      ],
      adjectives: ['Organic', 'Natural', 'Essential', 'Daily', 'Extra Strength', 'Fast-Acting', 'Complete']
  },
  'Gifts': { 
      items: [
          { noun: 'Perfume', priceRange: [2000, 15000] },
          { noun: 'Watch', priceRange: [2500, 25000] },
          { noun: 'Chocolate Box', priceRange: [500, 5000] },
          { noun: 'Jewelry Set', priceRange: [3000, 50000] },
          { noun: 'Gift Basket', priceRange: [1500, 10000] },
          { noun: 'Wallet', priceRange: [800, 5000] },
          { noun: 'Mug', priceRange: [300, 1500] },
          { noun: 'Pen Set', priceRange: [500, 4000] },
          { noun: 'Photo Frame', priceRange: [400, 2500] },
          { noun: 'Flowers', priceRange: [600, 4000] }
      ],
      adjectives: ['Personalized', 'Unique', 'Luxury', 'Handmade', 'Custom', 'Romantic', 'Special', 'Beautiful']
  }
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRealisticPrice = (min, max) => {
    let rawPrice = getRandomInt(min, max);
    if (rawPrice > 10000) {
        return Math.floor(rawPrice / 100) * 100 - 1; 
    } else if (rawPrice > 1000) {
        return Math.floor(rawPrice / 10) * 10 - 1; 
    }
    return rawPrice;
};

const generateProducts = () => {
    let allProducts = [];

    for (const [categoryName, categoryData] of Object.entries(categories)) {
        const { items, adjectives } = categoryData;
        
        for (let i = 0; i < 200; i++) { 
            const baseItem = items[Math.floor(Math.random() * items.length)];
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            
            const productName = `${randomAdjective} ${baseItem.noun} ${getRandomInt(100, 999)}`;
            const price = getRealisticPrice(baseItem.priceRange[0], baseItem.priceRange[1]);
            
            const imagePool = reliableImages[baseItem.noun];
            const imageUrl = imagePool[Math.floor(Math.random() * imagePool.length)];

            allProducts.push({
                name: productName,
                description: `Experience the finest quality ${productName.toLowerCase()}. Designed for excellence and highly recommended by professionals. Perfect for your daily needs.`,
                price: price,
                category: categoryName,
                imageUrl: imageUrl, 
                countInStock: getRandomInt(5, 150),
                rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
                numReviews: getRandomInt(10, 850)
            });
        }
    }

    console.log(`Generated ${allProducts.length} unique premium products.`);
    fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 4));
    console.log('Saved to products.json');
};

generateProducts();
