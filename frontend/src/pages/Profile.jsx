import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.token) {
      fetchMyOrders(user.token)
        .then(data => setOrders(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div style={{textAlign: 'center', padding: 'var(--spacing-12)'}}>Please log in to view your profile.</div>;

  const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return '#4CAF50';
        case 'Shipped': return '#2196F3';
        case 'Processing': return '#FF9800';
        case 'Cancelled': return '#F44336';
        default: return '#9E9E9E';
    }
  };

  return (
    <motion.div className="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem 5%' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>My Profile</h1>
      
      <div className="glass-panel" style={{ padding: 'var(--spacing-6)', marginBottom: 'var(--spacing-12)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
            {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ margin: 0, opacity: 0.7 }}>{user.email}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Order History</h2>
      
      {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>
      ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', padding: '3rem' }}>{error}</div>
      ) : orders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
              <Link to="/categories"><button className="btn btn-primary">Start Shopping</button></Link>
          </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: 'var(--spacing-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                    <span style={{ 
                        padding: '0.2rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        background: `${getStatusColor(order.status)}22`, 
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}44`,
                        fontWeight: 'bold'
                    }}>
                        {order.status}
                    </span>
                </div>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>Total: ₹{order.totalPrice.toFixed(2)}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <Link to={`/order/${order.id}`}><button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Track Order</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
