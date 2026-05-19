const fs = require('fs');

const path = 'AdminDashboard.jsx';
let data = fs.readFileSync(path, 'utf8');

// The problematic lines from our view_file:
// <line 29> const headers = { Authorization: \`Bearer \${user.token}\` };
// <line 52> await fetch(\`http://127.0.0.1:5001/api/admin/products/\${id}\`, {

// We will find and replace them directly using string replacement exactly to avoid regex issues.
const badAuth = "const headers = { Authorization: \\`Bearer \\${user.token}\\` };";
const goodAuth = "const headers = { Authorization: `Bearer ${user.token}` };";

const badFetch = "await fetch(\\`http://127.0.0.1:5001/api/admin/products/\\${id}\\`, {";
const goodFetch = "await fetch(`http://127.0.0.1:5001/api/admin/products/${id}`, {";

data = data.replace(badAuth, goodAuth);
data = data.replace(badFetch, goodFetch);

fs.writeFileSync(path, data);
console.log("Replaced backslash escaped template literals.");
