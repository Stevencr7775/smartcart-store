import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
      e.preventDefault(); // Prevent navigation when clicking the button
      e.stopPropagation();
      addToCart(product);
      toast.success('Added to Cart!');
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'} 
            alt={product.name} 
            className="product-image" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'; }} 
          />
          {product.isTrending && <span className="badge trending-badge">🔥 Trending</span>}
        </div>
        <div className="product-info">
          <div className="product-brand-row"><span className="product-brand">{product.brand}</span><p className="product-category">{product.category}</p></div>
          <h3 className="product-title">{product.name}</h3>
          <div className="product-footer">
            <span className="product-price">₹{product.price}</span>
            <button className="btn btn-primary add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
