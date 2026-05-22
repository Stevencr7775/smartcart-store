import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../api';
import './Cart.css';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Shipping state
    const [billingDetails, setBillingDetails] = useState({ name: '', email: '', address: '', city: '', postalCode: '', country: '' });
    
    // Checkout Portal states
    const [paymentMethod, setPaymentMethod] = useState('Card'); // Card, UPI, COD
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Simulated Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    // Simulated UPI State
    const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
    const [upiId, setUpiId] = useState('');
    const [showQr, setShowQr] = useState(true);

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

    // Card formatting helpers
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        // Add spaces every 4 digits
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setCardExpiry(value);
    };

    const handleCvvChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        setCardCvv(value);
    };

    // Detect card type for visa/mastercard/amex styling
    const getCardType = () => {
        const raw = cardNumber.replace(/\s/g, '');
        if (raw.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(raw)) return 'Mastercard';
        if (/^3[47]/.test(raw)) return 'Amex';
        return 'Card';
    };

    // Run premium payment processing sequence
    const processPaymentSequence = (onSuccessCallback) => {
        setIsProcessing(true);
        setProcessingStep(0);
        
        const steps = [
            "Initiating secure payment gateway...",
            "Validating transaction with bank...",
            `Authorizing charge of ₹${total.toFixed(2)}...`,
            "Securing connection and finalizing..."
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            if (currentStep < steps.length) {
                setProcessingStep(currentStep);
            } else {
                clearInterval(interval);
                setIsSuccess(true);
                // Wait for celebration and confetti screen
                setTimeout(() => {
                    onSuccessCallback();
                }, 2200);
            }
        }, 1200);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!billingDetails.address || !billingDetails.city || !billingDetails.postalCode || !billingDetails.country) {
            setErrorMessage('Please fill in all shipping address details first.');
            toast.error('Shipping address details are required.');
            return;
        }

        if (paymentMethod === 'Card') {
            const rawCard = cardNumber.replace(/\s/g, '');
            if (rawCard.length < 16) {
                setErrorMessage('Please enter a valid 16-digit credit card number.');
                return;
            }
            if (!cardName) {
                setErrorMessage('Cardholder Name is required.');
                return;
            }
            if (cardExpiry.length < 5) {
                setErrorMessage('Please enter a valid expiry date (MM/YY).');
                return;
            }
            if (cardCvv.length < 3) {
                setErrorMessage('Please enter a valid 3-digit CVV.');
                return;
            }
        }

        if (paymentMethod === 'UPI' && !showQr) {
            if (!upiId || !upiId.includes('@')) {
                setErrorMessage('Please enter a valid UPI ID (e.g., name@okaxis).');
                return;
            }
        }

        setErrorMessage('');
        processPaymentSequence(handleOrderPlacement);
    };

    const handleOrderPlacement = async () => {
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
                paymentMethod: paymentMethod === 'Card' ? 'Credit/Debit Card' : paymentMethod,
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: delivery,
                totalPrice: total
            };
            
            await createOrder(orderData, user.token);
            clearCart();
            setIsProcessing(false);
            setIsSuccess(false);
            navigate('/profile');
            toast.success(`Order placed successfully via ${paymentMethod}!`);
        } catch (err) {
            setIsProcessing(false);
            setIsSuccess(false);
            setErrorMessage('Payment succeeded, but failed to save order to database. Please contact support.');
            toast.error('Failed to create order in database.');
        }
    };

    // Form UPI Link for real scannable QR Code
    const upiLink = `upi://pay?pa=smartcart@paytm&pn=SmartCart%20Store&am=${total.toFixed(2)}&cu=INR&tn=SmartCart%20Secure%20Checkout`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

    const stepsText = [
        "Initiating secure payment gateway...",
        "Validating transaction with bank...",
        `Authorizing charge of ₹${total.toFixed(2)}...`,
        "Securing connection and finalizing..."
    ];

    return (
        <div className="checkout-page animate-fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="cart-title">Secure Checkout</h1>
            
            {/* Secure Transaction Loading / Processing Fullscreen Screen */}
            {isProcessing && (
                <div className="payment-processing-overlay">
                    {!isSuccess ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="processing-spinner-box">
                                <div className="processing-circle"></div>
                                <div className="processing-lock-icon">🔒</div>
                            </div>
                            <h3 className="processing-steps-text">{stepsText[processingStep]}</h3>
                            <p className="processing-sub-text">
                                <span className="spinner-small"></span> Do not refresh this page or click back.
                            </p>
                        </div>
                    ) : (
                        <div className="success-celebration">
                            <div className="success-checkmark-circle"></div>
                            <h2 className="celebration-title">Payment Successful!</h2>
                            <p className="celebration-sub">Your order is being processed. Redirecting to your profile...</p>
                        </div>
                    )}
                </div>
            )}

            <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px', marginTop: '20px' }}>
                
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '15px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.4rem', borderBottom: '1px solid var(--color-bg-subtle)', paddingBottom: '10px' }}>1. Shipping Details</h2>
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

                    <h2 style={{ marginBottom: '20px', fontSize: '1.4rem', borderBottom: '1px solid var(--color-bg-subtle)', paddingBottom: '10px' }}>2. Payment Method</h2>
                    
                    {/* Simulated Payment Portal Navigation Tabs */}
                    <div className="payment-tabs">
                        <button 
                            type="button"
                            onClick={() => setPaymentMethod('Card')}
                            className={`payment-tab-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
                        >
                            💳 Card Payment
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPaymentMethod('UPI')}
                            className={`payment-tab-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                        >
                            📱 UPI (Scan & Pay)
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPaymentMethod('COD')}
                            className={`payment-tab-btn ${paymentMethod === 'COD' ? 'active' : ''}`}
                        >
                            💵 COD (Cash)
                        </button>
                    </div>

                    {/* tabContent - Simulated Credit Card Gateway */}
                    {paymentMethod === 'Card' && (
                        <div className="animate-fade-in">
                            {/* Glassmorphic Live visual Card Preview widget */}
                            <div className="card-preview-section">
                                <div className={`payment-card ${isFlipped ? 'flipped' : ''}`}>
                                    <div className="card-face card-face-front">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div className="card-chip"></div>
                                            <div className="card-brand">{getCardType()}</div>
                                        </div>
                                        <div className="card-number-display">
                                            {cardNumber || '•••• •••• •••• ••••'}
                                        </div>
                                        <div className="card-info-row">
                                            <div>
                                                <div className="card-label">Card Holder</div>
                                                <div className="card-value">{cardName || 'YOUR NAME'}</div>
                                            </div>
                                            <div>
                                                <div className="card-label">Expires</div>
                                                <div className="card-value">{cardExpiry || 'MM/YY'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-face card-face-back">
                                        <div className="card-magnetic-strip"></div>
                                        <div className="card-signature-area">
                                            <span className="card-label" style={{ color: '#fff', marginRight: '10px' }}>CVV</span>
                                            <div className="card-cvv-display">{cardCvv || '•••'}</div>
                                        </div>
                                        <div className="card-back-text">
                                            This card belongs to the SmartCart Secure simulated gateway. Authorized use only for sandbox checking.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Form Details */}
                            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Card Number</label>
                                    <input 
                                        type="text"
                                        placeholder="4111 2222 3333 4444"
                                        required
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        onFocus={() => setIsFlipped(false)}
                                        className="form-control"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Cardholder Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Steve Rogers"
                                        required
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        onFocus={() => setIsFlipped(false)}
                                        className="form-control"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Expiration Date</label>
                                        <input 
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                            value={cardExpiry}
                                            onChange={handleExpiryChange}
                                            onFocus={() => setIsFlipped(false)}
                                            className="form-control"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>CVV Code</label>
                                        <input 
                                            type="password"
                                            placeholder="123"
                                            required
                                            value={cardCvv}
                                            onChange={handleCvvChange}
                                            onFocus={() => setIsFlipped(true)}
                                            onBlur={() => setIsFlipped(false)}
                                            className="form-control"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="btn btn-primary checkout-btn" 
                                    style={{ marginTop: '15px', width: '100%', padding: '14px', fontSize: '1.05rem' }}
                                >
                                    🔒 Pay ₹{total.toFixed(2)} Securely
                                </button>
                            </form>
                        </div>
                    )}

                    {/* tabContent - Simulated UPI Portal */}
                    {paymentMethod === 'UPI' && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowQr(true)}
                                    className="btn"
                                    style={{ padding: '8px 16px', background: showQr ? 'var(--color-primary)' : 'var(--color-bg-subtle)', color: showQr ? '#fff' : 'var(--color-text-main)', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                                >
                                    Scan QR Code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowQr(false)}
                                    className="btn"
                                    style={{ padding: '8px 16px', background: !showQr ? 'var(--color-primary)' : 'var(--color-bg-subtle)', color: !showQr ? '#fff' : 'var(--color-text-main)', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                                >
                                    Enter UPI ID
                                </button>
                            </div>

                            {showQr ? (
                                /* Scannable QR Code Subtab */
                                <div className="upi-qr-container animate-fade-in">
                                    <div className="upi-qr-wrapper">
                                        <div className="upi-qr-scanner-line"></div>
                                        <img src={qrCodeUrl} alt="UPI QR Code" className="upi-qr-image" />
                                    </div>
                                    <p className="upi-qr-info">
                                        Scan this QR using Google Pay, PhonePe, Paytm, or BHIM.
                                        It will open the transaction for <strong>₹{total.toFixed(2)}</strong>!
                                    </p>
                                    
                                    <button 
                                        type="button"
                                        onClick={handlePaymentSubmit}
                                        className="btn btn-primary checkout-btn" 
                                        style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '1.05rem' }}
                                    >
                                        I Have Scanned and Paid
                                    </button>
                                </div>
                            ) : (
                                /* UPI ID Entry Subtab */
                                <div className="animate-fade-in">
                                    {/* Popular UPI Apps Picker grid */}
                                    <div className="upi-app-grid">
                                        <div 
                                            className={`upi-app-card ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                                            onClick={() => { setSelectedUpiApp('gpay'); setUpiId(billingDetails.email.split('@')[0] + '@okaxis'); }}
                                        >
                                            <span className="upi-app-logo" style={{ color: '#4285F4' }}>📱</span>
                                            <span className="upi-app-name">G-Pay</span>
                                        </div>
                                        <div 
                                            className={`upi-app-card ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                                            onClick={() => { setSelectedUpiApp('phonepe'); setUpiId(billingDetails.email.split('@')[0] + '@ybl'); }}
                                        >
                                            <span className="upi-app-logo" style={{ color: '#5f259f' }}>🟣</span>
                                            <span className="upi-app-name">PhonePe</span>
                                        </div>
                                        <div 
                                            className={`upi-app-card ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                                            onClick={() => { setSelectedUpiApp('paytm'); setUpiId(billingDetails.email.split('@')[0] + '@paytm'); }}
                                        >
                                            <span className="upi-app-logo" style={{ color: '#00baf2' }}>🔵</span>
                                            <span className="upi-app-name">Paytm</span>
                                        </div>
                                        <div 
                                            className={`upi-app-card ${selectedUpiApp === 'bhim' ? 'selected' : ''}`}
                                            onClick={() => { setSelectedUpiApp('bhim'); setUpiId(billingDetails.email.split('@')[0] + '@upi'); }}
                                        >
                                            <span className="upi-app-logo" style={{ color: '#e05929' }}>🇮🇳</span>
                                            <span className="upi-app-name">BHIM</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>UPI ID (VPA)</label>
                                            <input 
                                                type="text"
                                                placeholder="steve@okaxis"
                                                required
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="form-control"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-bg-subtle)', background: 'var(--color-bg-main)', color: 'var(--color-text-main)' }}
                                            />
                                        </div>
                                        
                                        <button 
                                            type="submit"
                                            className="btn btn-primary checkout-btn" 
                                            style={{ marginTop: '15px', width: '100%', padding: '14px', fontSize: '1.05rem' }}
                                        >
                                            🔒 Request UPI Payment
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* tabContent - Simulated Cash on Delivery */}
                    {paymentMethod === 'COD' && (
                        <div className="animate-fade-in">
                            <div style={{ background: 'var(--color-primary-transparent, rgba(124,58,237,0.05))', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--color-primary)' }}>
                                <p style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>📌 Cash on Delivery Selected</p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                                    Your order will be packaged and delivered directly to your doorstep. 
                                    You will pay in cash or via a delivery UPI QR to the agent upon receiving your items. No advance payment is needed!
                                </p>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={handlePaymentSubmit}
                                className="btn btn-primary checkout-btn" 
                                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                            >
                                Confirm Order (Cash on Delivery)
                            </button>
                        </div>
                    )}

                    {errorMessage && (
                        <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '15px', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
                            ⚠️ {errorMessage}
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
