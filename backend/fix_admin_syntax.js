const fs = require('fs');
let content = fs.readFileSync('controllers/adminController.js', 'utf8');
content = content.replace(
    \`insight: \\\`Based on the sales frequency, \\\${bestSeller} is currently your most demanded product and drives the primary user engagement.\\\`\`,
    \`insight: \\\`Based on the sales frequency, \${bestSeller} is currently your most demanded product and drives the primary user engagement.\\\`\`
);
fs.writeFileSync('controllers/adminController.js', content);
console.log('Fixed adminController.js syntax error');
