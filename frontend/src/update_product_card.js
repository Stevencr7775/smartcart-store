const fs = require('fs');
let content = fs.readFileSync('components/ProductCard.jsx', 'utf8');

// Add Link import
if(!content.includes('import { Link }')) {
    content = content.replace(
        `import { useCart } from '../context/CartContext';`,
        `import { useCart } from '../context/CartContext';\nimport { Link } from 'react-router-dom';`
    );
}

// Wrap image and title in Link
content = content.replace(
`<h3 className="product-title">{product.name}</h3>`,
`<Link to={\`/product/\${product.id}\`} style={{textDecoration: 'none', color: 'inherit'}}>\n          <h3 className="product-title">{product.name}</h3>\n        </Link>`
);

content = content.replace(
`<img \n          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'} \n          alt={product.name} \n          className="product-image" \n        />`,
`<Link to={\`/product/\${product.id}\`}>\n          <img \n            src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'} \n            alt={product.name} \n            className="product-image" \n          />\n        </Link>`
);

fs.writeFileSync('components/ProductCard.jsx', content);
console.log('ProductCard updated with links to ProdDetails');
