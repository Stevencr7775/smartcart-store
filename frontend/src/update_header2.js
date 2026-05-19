const fs = require('fs');
const headerPath = '/Users/steve/.gemini/antigravity/brain/5318989b-b315-4603-968d-8d78fbe72566/frontend/src/components/Header.jsx';
let content = fs.readFileSync(headerPath, 'utf8');

content = content.replace(
`          {user ? (
              <div className="user-menu">
                  <span style={{marginRight: '1rem', fontWeight: 'bold'}}>{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Logout</button>
              </div>`,
`          {user ? (
              <div className="user-menu" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <span style={{fontWeight: 'bold'}}>{user.username || user.name}</span>
                  {user.role === 'admin' && (
                      <Link to="/admin" className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Logout</button>
              </div>`
);

fs.writeFileSync(headerPath, content);
console.log('Header updated successfully.');
