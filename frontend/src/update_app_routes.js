const fs = require('fs');
let content = fs.readFileSync('App.jsx', 'utf8');

if(!content.includes('ProductDetails')) {
    content = content.replace(
        `import About from './pages/About';`,
        `import About from './pages/About';\nimport ProductDetails from './pages/ProductDetails';`
    );

    content = content.replace(
        `<Route path="/about" element={<About />} />`,
        `<Route path="/about" element={<About />} />\n          <Route path="/product/:id" element={<ProductDetails />} />`
    );

    fs.writeFileSync('App.jsx', content);
    console.log('App.jsx updated with ProductDetails route');
}
