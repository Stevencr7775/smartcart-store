import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations } from '../api';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      setLoadingAi(true);
      fetchRecommendations(cartItems)
        .then(res => setRecommendations(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingAi(false));
    } else {
      setRecommendations([]);
    }
  }, [cartItems]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18; // 18% GST mock
  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + delivery;

  const handleCheckout = () => {
      if(!user) {
          navigate('/login?redirect=/cart');
          return;
      }
      navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart animate-fade-in">
        <div className="empty-state">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <h1 className="cart-title">Your Cart</h1>
      
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'; }} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price}</p>
              </div>
              
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cartItems.reduce((a,c) => a + c.qty, 0)} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18% GST)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="free-delivery">Free</span> : `₹${delivery.toFixed(2)}`}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <div className="payment-methods">
            <p>Secure Payments Supported</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="glass-panel" style={{ marginTop: 'var(--spacing-8)', padding: 'var(--spacing-6)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✨ AI Suggested for You</h3>
          {loadingAi ? <p>Analyzing your cart...</p> : (
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              {recommendations.map((rec, idx) => (
                <div key={idx} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => { navigate(`/categories?keyword=${encodeURIComponent(rec)}`); }}>
                  🔍 Search for {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
  
    </div>
  );
};

export default Cart;
