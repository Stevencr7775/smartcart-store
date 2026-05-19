const fs = require('fs');
const loginPath = '/Users/steve/.gemini/antigravity/brain/5318989b-b315-4603-968d-8d78fbe72566/frontend/src/pages/Login.jsx';
if(fs.existsSync(loginPath)){
let content = fs.readFileSync(loginPath, 'utf8');

content = content.replace(
`          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>`,
`          <div className="form-group">
            <label htmlFor="email">Email Address or Admin Username</label>
            <input 
              type="text" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>`
);

fs.writeFileSync(loginPath, content);
console.log('Login updated safely for Admin support.');
}
