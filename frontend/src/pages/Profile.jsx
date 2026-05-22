import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../api';
import { toast } from 'react-toastify';
import './Cart.css';

const avatarsList = [
  { emoji: '🦊', label: 'Smart Fox' },
  { emoji: '🦁', label: 'Courageous Lion' },
  { emoji: '🐯', label: 'Tiger Boss' },
  { emoji: '🐼', label: 'Lazy Panda' },
  { emoji: '🐨', label: 'Cozy Koala' },
  { emoji: '🤖', label: 'Cyber Robot' },
  { emoji: '👽', label: 'Space Alien' },
  { emoji: '🐱', label: 'Cute Kitten' },
  { emoji: '🐶', label: 'Loyal Puppy' },
  { emoji: '🦄', label: 'Magic Unicorn' },
  { emoji: '🧙‍♂️', label: 'Grand Wizard' },
  { emoji: '🚀', label: 'Super Rocket' }
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab control state
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, orders, settings

  // Profile Edit fields (initialized in useEffect once user is loaded)
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || user.username || '');
      setDisplayEmail(user.email || '');
      setSelectedAvatar(user.avatar || '🦊');
      setShippingAddress({
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || ''
      });
      
      if (user.token) {
        fetchMyOrders(user.token)
          .then(data => setOrders(data))
          .catch(err => setError(err.message))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }} className="animate-fade-in">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Please Log In</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You must be authenticated to access your dashboard settings.</p>
        <Link to="/login?redirect=/profile"><button className="btn btn-primary" style={{ padding: '12px 30px' }}>Go to Sign In</button></Link>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const pendingDeliveries = orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
  
  // Determine VIP Membership Tier
  const getMembershipTier = () => {
    if (totalSpent >= 10000) return { title: '💎 Platinum VIP', color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', shadow: '0 4px 15px rgba(139, 92, 246, 0.4)' };
    if (totalSpent >= 3000) return { title: '👑 Gold VIP Member', color: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: '0 4px 15px rgba(217, 119, 6, 0.4)' };
    return { title: '🌟 Silver Shopper', color: 'linear-gradient(135deg, #6b7280, #4b5563)', shadow: '0 4px 10px rgba(75, 85, 99, 0.3)' };
  };

  const membership = getMembershipTier();

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!displayName) {
      toast.error('Display Name cannot be empty.');
      return;
    }
    
    // Save to local storage persistent user context
    updateProfile({
      name: displayName,
      email: displayEmail,
      avatar: selectedAvatar,
      ...shippingAddress
    });
    
    toast.success('Profile and account details saved successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#10b981';
      case 'Shipped': return '#3b82f6';
      case 'Processing': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Stepper state helper
  const getStepperActiveIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  return (
    <motion.div className="profile-page animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Premium Cover & Profile Banner */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', marginBottom: '35px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '250px', height: '250px', background: 'var(--color-primary-transparent)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }}></div>
        
        <div className="profile-avatar-large" style={{ zIndex: 1 }}>
          {selectedAvatar}
        </div>
        
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {displayName}
            </h1>
            <span className="membership-badge" style={{ background: membership.color, boxShadow: membership.shadow }}>
              {membership.title}
            </span>
          </div>
          <p style={{ margin: '5px 0 0 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', fontWeight: '500' }}>
            Logged in as: <strong style={{ color: 'var(--color-text-main)' }}>{displayEmail}</strong>
          </p>
        </div>
      </div>

      {/* Tabbed Section Selection */}
      <div className="profile-tab-header">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`profile-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          📊 Dashboard Overview
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          📦 Order History ({totalOrders})
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          ⚙️ Account Settings
        </button>
      </div>

      {/* Dynamic Tab Rendering with Animations */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Card Grid */}
            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <div className="profile-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-primary)' }}>🛒</div>
                <div className="profile-stat-number">{totalOrders}</div>
                <div className="profile-stat-label">Total Orders</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>💰</div>
                <div className="profile-stat-number">₹{totalSpent.toFixed(2)}</div>
                <div className="profile-stat-label">Total Purchases</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>🚚</div>
                <div className="profile-stat-number">{pendingDeliveries}</div>
                <div className="profile-stat-label">In-Transit</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>💎</div>
                <div className="profile-stat-number" style={{ fontSize: '1.25rem', padding: '5px 0' }}>{membership.title.split(' ')[0]}</div>
                <div className="profile-stat-label">Member Tier</div>
              </div>
            </div>

            {/* Quick Profile Summary panel */}
            <div className="glass-panel" style={{ padding: '25px', borderRadius: '15px' }}>
              <h2 style={{ marginBottom: '15px', fontSize: '1.4rem' }}>🌟 Member Insights</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1.05rem', margin: 0 }}>
                Welcome to your premium SmartCart profile dashboard! As a <strong style={{ color: 'var(--color-primary)' }}>{membership.title}</strong>, you have access to priority delivery options and mock VIP refund assistance. 
                {totalSpent < 3000 && " Spend just ₹" + (3000 - totalSpent).toFixed(2) + " more to unlock Gold VIP benefits!"}
                {totalSpent >= 3000 && totalSpent < 10000 && " Spend just ₹" + (10000 - totalSpent).toFixed(2) + " more to unlock Platinum VIP benefits!"}
                {totalSpent >= 10000 && " You have achieved our highest shopper tier! Thank you for choosing SmartCart."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Orders History Tab */}
        {activeTab === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                <div className="spinner" style={{ marginBottom: '15px' }}></div>
                Retrieving your order log...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', color: '#ef4444', padding: '4rem' }}>⚠️ {error}</div>
            ) : orders.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>📦</div>
                <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>No purchases logged yet!</p>
                <Link to="/categories"><button className="btn btn-primary" style={{ padding: '10px 25px' }}>Explore Catalog</button></Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map(order => {
                  const stepperIdx = getStepperActiveIndex(order.status);
                  return (
                    <div key={order.id} className="glass-panel" style={{ padding: '25px', borderRadius: '15px', borderLeft: `5px solid ${getStatusColor(order.status)}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start', gap: '15px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Order #{order.id}</h3>
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '0.8rem', 
                              background: `${getStatusColor(order.status)}15`, 
                              color: getStatusColor(order.status),
                              border: `1px solid ${getStatusColor(order.status)}30`,
                              fontWeight: '800'
                            }}>
                              {order.status}
                            </span>
                          </div>
                          <p style={{ margin: '6px 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          
                          {/* Inline images of products inside order */}
                          <div className="order-product-grid">
                            {order.items && order.items.map((item, idx) => (
                              <img 
                                key={idx} 
                                src={item.image || item.imageUrl || '/placeholder.jpg'} 
                                alt={item.name} 
                                className="order-product-badge" 
                                title={`${item.name} (x${item.quantity})`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>₹{order.totalPrice.toFixed(2)}</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>Method: {order.paymentMethod || 'Simulated'}</p>
                          <Link to={`/order/${order.id}`} style={{ marginTop: '12px', display: 'inline-block' }}>
                            <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Track Order</button>
                          </Link>
                        </div>
                      </div>

                      {/* Visual Stepper tracker inside card if order is not Cancelled */}
                      {order.status !== 'Cancelled' && (
                        <div className="order-stepper-container">
                          <div className="order-stepper-progress-bar">
                            <div className="order-stepper-progress-fill" style={{ width: `${(stepperIdx / 3) * 100}%` }}></div>
                          </div>
                          
                          {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => (
                            <div 
                              key={step} 
                              className={`order-stepper-node ${idx === stepperIdx ? 'active' : ''} ${idx < stepperIdx ? 'completed' : ''}`}
                            >
                              <div className="order-stepper-dot">
                                {idx < stepperIdx ? '✓' : idx + 1}
                              </div>
                              <span className="order-stepper-label">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Account Settings */}
        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel"
            style={{ padding: '30px', borderRadius: '15px' }}
          >
            <h2 style={{ marginBottom: '25px', fontSize: '1.4rem', borderBottom: '1px solid var(--color-bg-subtle)', paddingBottom: '10px' }}>⚙️ Personalize Account Details</h2>
            
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Profile Avatar choice */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Choose Avatar Character</label>
                <div className="avatar-selection-grid">
                  {avatarsList.map(item => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(item.emoji)}
                      className={`avatar-bubble-btn ${selectedAvatar === item.emoji ? 'selected' : ''}`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Display Name</label>
                  <input 
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email Address</label>
                  <input 
                    type="email"
                    required
                    value={displayEmail}
                    onChange={(e) => setDisplayEmail(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                  />
                </div>
              </div>

              {/* Saved Shipping Addresses */}
              <h3 style={{ marginTop: '20px', fontSize: '1.15rem', borderBottom: '1px solid var(--color-bg-subtle)', paddingBottom: '8px', fontWeight: '700' }}>Saved Shipping Address</h3>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Street Address</label>
                <input 
                  type="text"
                  placeholder="123 Street Name"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="form-control"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>City</label>
                  <input 
                    type="text"
                    placeholder="Mumbai"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="form-control"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Postal Code</label>
                  <input 
                    type="text"
                    placeholder="400001"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    className="form-control"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Country</label>
                  <input 
                    type="text"
                    placeholder="India"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="form-control"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="btn btn-primary" 
                style={{ marginTop: '20px', padding: '14px', fontSize: '1.05rem', alignSelf: 'flex-start', minWidth: '200px' }}
              >
                💾 Save Profile Changes
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
