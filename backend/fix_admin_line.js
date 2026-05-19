const fs = require('fs');
const filePath = 'controllers/adminController.js';
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

// Line 85 is index 84
lines[84] = '            insight: `Based on the sales frequency, ${bestSeller} is currently your most demanded product and drives the primary user engagement.`';

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Line 85 replaced exactly.');
