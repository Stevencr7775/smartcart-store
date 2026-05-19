import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchOrderById } from '../api';

const OrderTracking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.token) {
            fetchOrderById(id, user.token)
                .then(data => setOrder(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, user]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading order details...</div>;
    if (error || !order) return <div style={{ textAlign: 'center', padding: '5rem', color: 'red' }}>{error || 'Order not found'}</div>;

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = steps.indexOf(order.status);

    return (
        <motion.div className="main-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 5%' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/profile" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Orders
                </Link>
                <h1 style={{ margin: 0 }}>Order Tracking</h1>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <div>
                        <p style={{ margin: 0, opacity: 0.7 }}>Order ID</p>
                        <h3 style={{ margin: 0 }}>#{order.id}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, opacity: 0.7 }}>Order Date</p>
                        <h3 style={{ margin: 0 }}>{new Date(order.createdAt).toLocaleDateString()}</h3>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div style={{ padding: '2rem 0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                        {steps.map((step, index) => (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: index <= currentStepIndex ? 'var(--color-primary)' : 'var(--glass-bg)',
                                    border: '2px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: index <= currentStepIndex ? 'white' : 'inherit',
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {index < currentStepIndex ? '✓' : index + 1}
                                </div>
                                <span style={{ fontWeight: index === currentStepIndex ? 'bold' : 'normal', opacity: index <= currentStepIndex ? 1 : 0.5 }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Progress Line */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '40px', 
                        left: '12.5%', 
                        right: '12.5%', 
                        height: '2px', 
                        background: 'var(--glass-border)', 
                        zIndex: 0 
                    }}>
                        <div style={{ 
                            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`, 
                            height: '100%', 
                            background: 'var(--color-primary)', 
                            transition: 'width 0.5s ease' 
                        }}></div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Order Items</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {order.orderItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                                    <p style={{ margin: 0, opacity: 0.7 }}>Quantity: {item.qty}</p>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>₹{item.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3>Shipping Address</h3>
                        <p style={{ opacity: 0.8, lineHeight: '1.6', margin: '1rem 0 0 0' }}>
                            {order.shippingAddress ? JSON.parse(order.shippingAddress) : 'No address provided'}
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal</span>
                                <span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tax</span>
                                <span>₹{order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span className="text-gradient">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderTracking;
