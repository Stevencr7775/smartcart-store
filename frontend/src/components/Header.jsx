import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/categories?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/categories');
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" stroke-width="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>
          <span className="logo-text">SmartCart</span>
        </Link>
        
        <form className="search-bar" onSubmit={submitHandler}>
          <input 
            type="text" 
            placeholder="Search premium electronics..." 
            className="search-input"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <nav className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle" style={{ fontSize: '1.5rem', marginRight: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/categories" className="nav-link">Shop</Link>
          
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/cart" className="nav-link cart-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> <span className="cart-badge">{cartCount}</span>
          </Link>
          {user ? (
              <div className="user-menu">
                  <Link to="/profile" style={{marginRight: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                      <span style={{ fontSize: '1.25rem' }}>{user.avatar || '🦊'}</span>
                      <span>{user.name || user.username}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Logout</button>
              </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
