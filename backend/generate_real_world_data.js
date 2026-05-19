const fs = require('fs');

const categories = [
  'Electronics', 'Clothing', 'Home Decor', 'Beauty', 'Medicines', 'Sports', 'Gifts'
];

const dataPool = {
  'Electronics': {
    brands: ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Google', 'Logitech', 'Bose', 'Microsoft', 'Asus'],
    types: [
      { name: 'Smartphone', img: 'photo-1511707171634-5f897ff02aa9' },
      { name: 'Laptop', img: 'photo-1496181133206-80ce9b88a853' },
      { name: 'Headphones', img: 'photo-1505740420928-5e560c06d30e' },
      { name: 'Watch', img: 'photo-1523275335684-37898b6baf30' },
      { name: 'Camera', img: 'photo-1516035069371-29a1b244cc32' }
    ]
  },
  'Clothing': {
    brands: ['Nike', 'Adidas', "Levi's", 'Zara', 'H&M', 'Uniqlo', 'Puma', 'Under Armour', 'Ralph Lauren', 'Tommy Hilfiger'],
    types: [
      { name: 'Sneakers', img: 'photo-1542291026-7eec264c27ff' },
      { name: 'Hoodie', img: 'photo-1556821840-3a63f95609a7' },
      { name: 'T-Shirt', img: 'photo-1521572163474-6864f9cf17ab' },
      { name: 'Jeans', img: 'photo-1542272604-787c3835535d' },
      { name: 'Jacket', img: 'photo-1551028719-00167b16eac5' }
    ]
  },
  'Home Decor': {
    brands: ['IKEA', 'West Elm', 'Herman Miller', 'Wayfair', 'Pottery Barn', 'Zinus', 'Ashley', 'Article'],
    types: [
      { name: 'Chair', img: 'photo-1567538096630-e0c55bd6374c' },
      { name: 'Lamp', img: 'photo-1507473885765-e6ed057f782c' },
      { name: 'Desk', img: 'photo-1518455027359-f3f8139ca67f' },
      { name: 'Vase', img: 'photo-1581783898377-1c85bf937427' },
      { name: 'Sofa', img: 'photo-1555041469-a586c61ea9bc' }
    ]
  },
  'Beauty': {
    brands: ['Chanel', 'Dior', "L'Oreal", 'Estee Lauder', 'Sephora', 'MAC', 'Clinique', "Kiehl's"],
    types: [
      { name: 'Perfume', img: 'photo-1541643600914-78b084683601' },
      { name: 'Serum', img: 'photo-1570172619644-dfd03ed5d881' },
      { name: 'Lipstick', img: 'photo-1586790170083-2f9ceadc732d' },
      { name: 'Moisturizer', img: 'photo-1556228578-0d85b1a4d571' }
    ]
  },
  'Medicines': {
    brands: ['Pfizer', 'GSK', 'Bayer', 'Johnson & Johnson', 'Sanofi', 'Roche'],
    types: [
      { name: 'Multivitamin', img: 'photo-1471864190281-a93a3070b6de' },
      { name: 'Pain Relief', img: 'photo-1584308666744-24d5c474f2ae' },
      { name: 'First Aid Kit', img: 'photo-1603398938378-e54eab446f8a' },
      { name: 'Vitamin C', img: 'photo-1616670845340-96020526017b' }
    ]
  },
  'Sports': {
    brands: ['Wilson', 'Spalding', 'Decathlon', 'Yonex', 'Mizuno', 'Speedo', 'Castore'],
    types: [
      { name: 'Football', img: 'photo-1574629810360-7efbbe195018' },
      { name: 'Racket', img: 'photo-1617083270634-17709b11e28f' },
      { name: 'Yoga Mat', img: 'photo-1544367567-0f2fcb009e0b' },
      { name: 'Dumbbell', img: 'photo-1586401100295-7a8096fd231a' }
    ]
  },
  'Gifts': {
    brands: ['LEGO', 'Hallmark', 'Swarovski', 'Pandora', 'Disney', 'Mattel'],
    types: [
      { name: 'Teddy Bear', img: 'photo-1559454403-b8fb88521f11' },
      { name: 'Flower Box', img: 'photo-1526047932273-341f2a7631f9' },
      { name: 'Card Set', img: 'photo-1527524440379-358cb0a7c04f' },
      { name: 'LEGO Set', img: 'photo-1585366119957-e9730b6d0f60' }
    ]
  }
};

const allProducts = [];

categories.forEach(cat => {
  const pool = dataPool[cat];
  for (let i = 1; i <= 60; i++) {
    const brand = pool.brands[Math.floor(Math.random() * pool.brands.length)];
    const type = pool.types[Math.floor(Math.random() * pool.types.length)];
    
    allProducts.push({
      name: `${brand} ${type.name} Series ${i}`,
      category: cat,
      brand: brand,
      price: Math.floor(Math.random() * (100000 - 500) + 500),
      imageUrl: `https://images.unsplash.com/${type.img}?w=800`,
      description: `Experience the pinnacle of ${cat} with the ${brand} ${type.name}. Engineered for quality and performance.`,
      specifications: {
        "Model": `V${i}`,
        "Quality": "Premium",
        "Source": "Official Distributor"
      }
    });
  }
});

fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 4));
console.log(`Generated ${allProducts.length} products total (~60 per category).`);
