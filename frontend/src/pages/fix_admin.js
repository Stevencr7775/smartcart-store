const fs = require('fs');
let code = fs.readFileSync('AdminDashboard.jsx', 'utf8');

code = code.replace(/Authorization: \\`Bearer \\\${%user.token}\\`/g, 'Authorization: `Bearer ${%user.token}`'.replace(/%/g, ''));
code = code.replace(/\\\`http://127.0.0.1:5001/api/admin/products/\\\${lid}\\\`/g, '`http://127.0.0.1:5001/api/admin/products/${lid}`'.replace(/%/g, '').replace(/\lid/g, 'id'));
fs.writeFileSync('AdminDashboard.jsx', code);
console.log('Fixed escape sequences');