import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const keyword = location.search ? location.search.split('=')[1] : '';

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(keyword);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [keyword]);

  const categories = [
    { name: 'Electronics', icon: '📱', color: 'var(--color-info)' },
    { name: 'Home Decor', icon: '🏡', color: 'var(--color-warning)' },
    { name: 'Beauty', icon: '💄', color: '#ec4899' },
    { name: 'Clothing', icon: '👕', color: 'var(--color-primary)' },
    { name: 'Health', icon: '💊', color: 'var(--color-success)' },
    { name: 'Sports', icon: '⚽', color: 'var(--color-accent, #ff5722)' },
    { name: 'Gifts', icon: '🎁', color: 'var(--color-error)' },
  ];

  return (
    <motion.div className="home-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span className="text-gradient">SmartCart</span></h1>
          
          <div className="hero-actions">
            <Link to="/categories"><button className="btn btn-primary hero-btn">Explore Products</button></Link>
            {/* The AI widget will be implemented globally later */}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/categories" className="view-all">View All &rarr;</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link to={`/categories/${cat.name.toLowerCase().replace(' ', '-')}`} key={index} className="category-card" style={{ '--cat-color': cat.color }}>
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <span className="ai-badge">✨ AI Picked for You</span>
        </div>
        
        {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
        ) : error ? (
            <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</div>
        ) : (
            <div className="products-grid">
              {products.slice(0, 12).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Subscribe to our Newsletter</h2>
          <p>Get 10% off your first order plus exclusive AI-curated offers.</p>
          <div className="promo-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
