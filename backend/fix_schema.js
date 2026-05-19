const fs = require('fs');
let code = fs.readFileSync('models/Product.js', 'utf8');

code = code.replace(/stock: \{ type: Number, required: true, default: 0 \}/, 'countInStock: { type: Number, required: true, default: 0 }');
code = code.replace(/image: \{ type: String \}/, 'imageUrl: { type: String }');

fs.writeFileSync('models/Product.js', code);
