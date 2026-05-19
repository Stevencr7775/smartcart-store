const fs = require('fs');

const authPath = './frontend/src/context/AuthContext.jsx';
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace(
`  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);`,
`  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
      localStorage.removeItem('userInfo');
    }
    setLoading(false);
  }, []);`);
fs.writeFileSync(authPath, authContent);

const cartPath = './frontend/src/context/CartContext.jsx';
let cartContent = fs.readFileSync(cartPath, 'utf8');
cartContent = cartContent.replace(
`  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);`,
`  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart && storedCart !== 'undefined') {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart items', e);
      localStorage.removeItem('cartItems');
    }
  }, []);`);
fs.writeFileSync(cartPath, cartContent);
console.log('Contexts fixed.');
