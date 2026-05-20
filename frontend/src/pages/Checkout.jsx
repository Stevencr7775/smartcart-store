let API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = API_URL + '/api';
}
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../api';
import './Cart.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const StripePaymentBox = ({ clientSecret, billingDetails, onPaymentSuccess, onPaymentError, total }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStripePay = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            name: billingDetails.name,
                            email: billingDetails.email,
                        }
                    }
                },
                redirect: 'if_required',
            });

            if (error) {
                onPaymentError(error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onPaymentSuccess();
            } else {
                onPaymentError('An unexpected payment error occurred.');
            }
        } catch (err) {
            onPaymentError(err.message || 'Payment execution failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="stripe-payment-form animate-fade-in" style={{ marginTop: '15px' }}>
            <PaymentElement />
            <button 
                onClick={handleStripePay}
                disabled={isProcessing || !stripe || !elements} 
                className="btn btn-primary checkout-btn" 
                style={{ marginTop: '20px', width: '100%', padding: '12px' }}
            >
                {isProcessing ? 'Processing Secure Payment...' : 'Pay ₹' + total.toFixed(2)}
            </button>
        </div>
    );
};

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [billingDetails, setBillingDetails] = useState({ name: '', email: '', address: '', city: '', postalCode: '', country: '' });
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [clientSecret, setClientSecret] = useState('');
    const [loadingSecret, setLoadingSecret] = useState(false);
    const [secretError, setSecretError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessingCod, setIsProcessingCod] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.18;
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + delivery;

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
        setBillingDetails(prev => ({
            ...prev,
            name: user.username || user.name || '',
            email: user.email || ''
        }));
    }, [user, cartItems, navigate]);

    useEffect(() => {
        if (!user || cartItems.length === 0 || paymentMethod !== 'Stripe' || clientSecret) {
            return;
        }

        const fetchClientSecret = async () => {
            setLoadingSecret(true);
            setSecretError('');
            try {
                const response = await fetch(API_URL + '/payment/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + user.token,
                    },
                    body: JSON.stringify({ totalPrice: total }),
                });
                
                const data = await response.json();
                if (response.ok) {
                    setClientSecret(data.clientSecret);
                } else {
                    setSecretError(data.error || 'Failed to initialize Stripe payment intent.');
                }
            } catch (err) {
                setSecretError('Stripe server is unreachable. Please try again or select Cash on Delivery.');
            } finally {
                setLoadingSecret(false);
            }
        };

        fetchClientSecret();
    }, [user, cartItems, paymentMethod, total, clientSecret]);

    const handleCodSubmit = async (e) => {
        e.preventDefault();
        if (!billingDetails.address || !billingDetails.city || !billingDetails.postalCode || !billingDetails.country) {
            setErrorMessage('Please fill in all shipping address fields.');
            return;
        }

        setIsProcessingCod(true);
        setErrorMessage('');
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.imageUrl,
                    price: item.price,
                    product: item.id
                })),
                shippingAddress: {
                    address: billingDetails.address,
                    city: billingDetails.city,
                    postalCode: billingDetails.postalCode,
                    country: billingDetails.country
                },
                paymentMethod: 'COD',
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: delivery,
                totalPrice: total
            };
            
            await createOrder(orderData, user.token);
            clearCart();
            navigate('/profile');
            toast.success('Order placed successfully via Cash on Delivery!');
        } catch (err) {
            setErrorMessage('Failed to save order to database.');
        } finally {
            setIsProcessingCod(false);
        }
    };

    const handleStripeOrderSuccess = async () => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.imageUrl,
                    price: item.price,
                    product: item.id
                })),
                shippingAddress: {
                    address: billingDetails.address || 'Online Checkout',
                    city: billingDetails.city || 'Online Checkout',
                    postalCode: billingDetails.postalCode || '000000',
                    country: billingDetails.country || 'India'
                },
                paymentMethod: 'Stripe',
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: delivery,
                totalPrice: total
            };
            
            await createOrder(orderData, user.token);
            clearCart();
            navigate('/profile');
            toast.success('Payment successful and order placed!');
        } catch (err) {
            setErrorMessage('Payment succeeded, but failed to save order to database. Please contact support.');
        }
    };

    const stripeOptions = {
        clientSecret,
        theme: 'stripe',
        paymentMethodOrder: ['upi', 'card'],
    };

    return (
        <div className="checkout-page animate-fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="cart-title">Secure Checkout</h1>
            
            <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px', marginTop: '20px' }}>
                
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '15px' }}>
                    <h2 style={{ marginBottom: '20px' }}>1. Shipping Details</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={billingDetails.name} 
                                    onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})} 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={billingDetails.email} 
                                    onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})} 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Address</label>
                            <input 
                                type="text" 
                                placeholder="123 Street Name" 
                                required 
                                value={billingDetails.address} 
                                onChange={(e) => setBillingDetails({...billingDetails, address: e.target.value})} 
                                className="form-control" 
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>City</label>
                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    required 
                                    value={billingDetails.city} 
                                    onChange={(e) => setBillingDetails({...billingDetails, city: e.target.value})} 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Postal Code</label>
                                <input 
                                    type="text" 
                                    placeholder="123456" 
                                    required 
                                    value={billingDetails.postalCode} 
                                    onChange={(e) => setBillingDetails({...billingDetails, postalCode: e.target.value})} 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Country</label>
                                <input 
                                    type="text" 
                                    placeholder="Country" 
                                    required 
                                    value={billingDetails.country} 
                                    onChange={(e) => setBillingDetails({...billingDetails, country: e.target.value})} 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} 
                                />
                            </div>
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '20px' }}>2. Payment Method</h2>
                    <div className="payment-method-selector" style={{ display: 'flex', gap: '20px', marginBottom: '25px', background: 'var(--color-bg-subtle)', padding: '15px', borderRadius: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="Stripe" 
                                checked={paymentMethod === 'Stripe'} 
                                onChange={() => setPaymentMethod('Stripe')} 
                                style={{ transform: 'scale(1.2)' }}
                            />
                            💳 Credit / Debit Card (Stripe)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="COD" 
                                checked={paymentMethod === 'COD'} 
                                onChange={() => setPaymentMethod('COD')} 
                                style={{ transform: 'scale(1.2)' }}
                            />
                            💵 Cash on Delivery (COD)
                        </label>
                    </div>

                    {paymentMethod === 'Stripe' && (
                        <div style={{ marginTop: '20px' }}>
                            {loadingSecret && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    <div className="spinner" style={{ marginBottom: '10px' }}></div>
                                    Initializing secure payment form...
                                </div>
                            )}
                            
                            {secretError && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <p style={{ fontWeight: '600' }}>⚠️ Payment Gateway Error:</p>
                                    <p style={{ fontSize: '0.95rem' }}>{secretError}</p>
                                    <button 
                                        onClick={() => { setClientSecret(''); setSecretError(''); }}
                                        className="btn btn-secondary" 
                                        style={{ marginTop: '10px', padding: '5px 12px', fontSize: '0.85rem' }}
                                    >
                                        Retry Connection
                                    </button>
                                </div>
                            )}

                            {clientSecret && (
                                <Elements stripe={stripePromise} options={stripeOptions}>
                                    <StripePaymentBox 
                                        clientSecret={clientSecret}
                                        billingDetails={billingDetails}
                                        onPaymentSuccess={handleStripeOrderSuccess}
                                        onPaymentError={(msg) => setErrorMessage(msg)}
                                        total={total}
                                    />
                                </Elements>
                            )}
                        </div>
                    )}

                    {paymentMethod === 'COD' && (
                        <div className="animate-fade-in" style={{ marginTop: '20px' }}>
                            <div style={{ background: 'var(--color-primary-transparent)', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--color-primary)' }}>
                                <p style={{ fontWeight: '600', color: 'var(--color-primary-hover)' }}>📌 Cash on Delivery Selected</p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginTop: '5px' }}>
                                    You will pay in cash or via UPI to the delivery agent upon receiving your items.
                                </p>
                            </div>
                            <button 
                                onClick={handleCodSubmit}
                                disabled={isProcessingCod}
                                className="btn btn-primary checkout-btn" 
                                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                            >
                                {isProcessingCod ? 'Placing Order...' : 'Confirm Order (Cash on Delivery)'}
                            </button>
                        </div>
                    )}

                    {errorMessage && (
                        <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '15px', textAlign: 'center' }}>
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="cart-summary" style={{ position: 'sticky', top: '100px' }}>
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Items ({cartItems.reduce((a,c) => a + c.qty, 0)})</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax (18% GST)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>{delivery === 0 ? <span className="free-delivery">Free</span> : '₹' + delivery.toFixed(2)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
