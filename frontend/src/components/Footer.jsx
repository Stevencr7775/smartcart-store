import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">SmartCart</span>
          </Link>
          <p className="footer-description">
            Your destination for AI-powered, personalized shopping experiences. 
            Discover what you need before you even know you need it.
          </p>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/categories/electronics">Electronics</Link></li>
            <li><Link to="/categories/home-decor">Home Decor</Link></li>
            <li><Link to="/categories/beauty">Beauty</Link></li>
            <li><Link to="/categories/clothing">Clothing</Link></li>
            <li><Link to="/categories/health">Health</Link></li>
            <li><Link to="/categories/sports">Sports</Link></li>
            <li><Link to="/categories/gifts">Gifts</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get recommendations and offers straight to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SmartCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
