import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../api';
import './Cart.css';

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [billingDetails, setBillingDetails] = useState({ name: '', email: '' });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.18;
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + delivery;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (paymentMethod === 'COD') {
            setIsProcessing(true);
            try {
                const orderData = {
                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.imageUrl,
                        price: item.price,
                        product: item.id
                    })),
                    shippingAddress: { address: 'Mock Address', city: 'Mock City', postalCode: '12345', country: 'Mock Country'},
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
            }
            setIsProcessing(false);
            return;
        }

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/order-success',
                payment_method_data: {
                    billing_details: {
                        name: billingDetails.name,
                        email: billingDetails.email,
                    }
                }
            },
            redirect: 'if_required', // Prevents automatic redirect to return_url so we can save order first
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Save order to DB
            try {
                const orderData = {
                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.imageUrl,
                        price: item.price,
                        product: item.id
                    })),
                    shippingAddress: { address: 'Mock Address', city: 'Mock City', postalCode: '12345', country: 'Mock Country'},
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
                 setErrorMessage('Payment succeeded, but failed to save order to database.');
            }
            setIsProcessing(false);
        } else {
            setErrorMessage('An unexpected error occurred.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2 className="payment-title">Payment Details</h2>

            <div className="billing-details" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Full Name" required value={billingDetails.name} onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})} className="form-control" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="email" placeholder="Email Address" required value={billingDetails.email} onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})} className="form-control" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div className="payment-method-selector" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Stripe" 
                        checked={paymentMethod === 'Stripe'} 
                        onChange={() => setPaymentMethod('Stripe')} 
                    />
                    Credit / Debit Card (Stripe)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="COD" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')} 
                    />
                    Cash on Delivery (COD)
                </label>
            </div>

            {paymentMethod === 'Stripe' && <PaymentElement />}
            <div className="payment-summary">
                <span>Total to Pay:</span>
                <span>₹{total.toFixed(2)}</span>
            </div>
            {errorMessage && <div className="payment-error">{errorMessage}</div>}
            <button 
                disabled={isProcessing || (paymentMethod === 'Stripe' && (!stripe || !elements))} 
                className="btn btn-primary checkout-btn" 
                id="submit"
            >
                <span id="button-text">
                    {isProcessing ? "Processing ... " : (paymentMethod === 'Stripe' ? "Pay now" : "Place Order")}
                </span>
            </button>
        </form>
    );
};

const Checkout = () => {
    const { cartItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");

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

        const fetchClientSecret = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5001/api/payment/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ totalPrice: total }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                   setClientSecret(data.clientSecret);
                } else {
                   console.error("Failed to create payment intent: ", data.error);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchClientSecret();
    }, [user, cartItems, navigate, total]);

    if (!clientSecret) {
        return (
            <div className="checkout-page animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner">Loading payment gateway...</div>
            </div>
        );
    }

    const options = {
        clientSecret,
        theme: 'stripe',
        paymentMethodOrder: ['upi', 'card', 'apple_pay', 'google_pay'],
    };

    return (
        <div className="checkout-page animate-fade-in">
            <h1 className="cart-title">Secure Checkout</h1>
            <div className="cart-layout checkout-layout">
                 <div className="cart-summary checkout-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Items ({cartItems.reduce((a,c) => a + c.qty, 0)})</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                     <div className="summary-row">
                        <span>Tax</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                     <div className="summary-row">
                        <span>Delivery</span>
                        <span>₹{delivery.toFixed(2)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="stripe-container">
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
