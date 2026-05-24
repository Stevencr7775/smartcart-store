import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts, fetchProductReviews, addReview } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // App Context
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // Data State
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState('description'); // description, specs, reviews
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const getProductAndRecommendations = async () => {
      try {
        setLoading(true);
        // Fetch current product
        const data = await fetchProductById(id);
        setProduct(data);
        
        // Fetch reviews
        const reviewData = await fetchProductReviews(id);
        setReviews(reviewData);
        
        // Recommendations logic
        const allProducts = await fetchProducts();
        const related = allProducts
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 4);
        
        setRecommendations(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProductAndRecommendations();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setReviewLoading(true);
    try {
      await addReview({ rating, comment, productId: id }, user.token);
      toast.success('Review added successfully');
      setComment('');
      setRating(5);
      const reviewData = await fetchProductReviews(id);
      setReviews(reviewData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '3rem'}}>Loading product details...</div>;
  if (error || !product) return <div style={{textAlign: 'center', color: 'red', padding: '3rem'}}>{error || "Product not found"}</div>;
  
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) : 0;
  
  return (
    <div className="product-details-page animate-fade-in" style={{ padding: '2rem 5%' }}>
        <div className="product-details-hero" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
            <div className="pd-image glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'} 
                  alt={product.name} 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'; }} 
                />
            </div>
            <div className="pd-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {product.brand || 'Premium Selection'}
                  </span>
                </div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>{product.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ padding: '0.2rem 0.8rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {product.category}
                  </span>
                  {reviews.length > 0 && (
                    <div style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))} 
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
                
                <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>₹{product.price.toFixed(2)}</p>
                
                <div style={{ marginBottom: '2rem' }}>
                  {(product.countInStock > 0 || product.stock > 0) ? (
                    <span style={{ color: '#4CAF50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></span>
                      In Stock ({product.countInStock ?? product.stock} available)
                    </span>
                  ) : (
                    <span style={{ color: '#f44336', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', background: '#f44336', borderRadius: '50%' }}></span>
                      Out of Stock
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '3rem', color: 'var(--color-text-muted)' }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    disabled={!(product.countInStock > 0 || product.stock > 0)}
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: (product.countInStock > 0 || product.stock > 0) ? 'pointer' : 'not-allowed' }}
                    onClick={() => {
                        addToCart(product);
                        toast.success('Item added to cart!');
                    }}
                  >
                      {(product.countInStock > 0 || product.stock > 0) ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    disabled={!(product.countInStock > 0 || product.stock > 0)}
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: '#ff9800', color: 'white', border: 'none', cursor: (product.countInStock > 0 || product.stock > 0) ? 'pointer' : 'not-allowed' }}
                    onClick={() => {
                        addToCart(product);
                        navigate('/checkout');
                    }}
                  >
                      Buy Now
                  </button>
                  <button 
                    className="btn btn-outline"
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: 'transparent', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', cursor: 'pointer' }}
                    onClick={() => {
                        toast.success('Added to Wish List!');
                    }}
                  >
                      Save to Wish List
                  </button>
                </div>
            </div>
        </div>

        {/* Tabbed Interface */}
        <div className="product-tabs-container glass-panel" style={{ marginBottom: '4rem', padding: '0' }}>
          <div className="tabs-header" style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} 
              onClick={() => setActiveTab('description')}
              style={{ flex: 1, padding: '1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'description' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} 
              onClick={() => setActiveTab('specs')}
              style={{ flex: 1, padding: '1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'specs' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('reviews')}
              style={{ flex: 1, padding: '1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'reviews' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              Reviews ({reviews.length})
            </button>
          </div>
          
          <div className="tabs-content" style={{ padding: '3rem' }}>
            {activeTab === 'description' && (
              <div className="tab-pane animate-fade-in">
                <h3 style={{ marginBottom: '1.5rem' }}>Product Overview</h3>
                <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>{product.description}</p>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="tab-pane animate-fade-in">
                <h3 style={{ marginBottom: '1.5rem' }}>Technical Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '1rem', fontWeight: 'bold', width: '30%', backgroundColor: 'rgba(0,0,0,0.1)' }}>{key}</td>
                          <td style={{ padding: '1rem' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No specifications available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  
                  {/* Reviews List */}
                  <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h3>
                    {reviews.length === 0 ? <p>No reviews yet. Be the first to review this product!</p> : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {reviews.map(rev => (
                          <div key={rev.id} style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <strong>{rev.User?.name || 'Anonymous'}</strong>
                              <span style={{ color: 'var(--color-warning)' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Write Review Form */}
                  <div>
                    <div style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Write a Review</h3>
                      {user ? (
                        <form onSubmit={submitReviewHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating (1-5)</label>
                            <select 
                              value={rating} 
                              onChange={(e) => setRating(Number(e.target.value))} 
                              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-color)', color: 'var(--color-text)' }}
                            >
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Very Good</option>
                              <option value="3">3 - Good</option>
                              <option value="2">2 - Fair</option>
                              <option value="1">1 - Poor</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Review</label>
                            <textarea 
                              value={comment} 
                              onChange={(e) => setComment(e.target.value)} 
                              required 
                              rows="4" 
                              placeholder="What did you like or dislike?"
                              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-color)', color: 'var(--color-text)' }}
                            ></textarea>
                          </div>
                          <button disabled={reviewLoading} type="submit" className="btn btn-primary">
                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                          <p style={{ marginBottom: '1.5rem' }}>You must be logged in to write a review.</p>
                          <button onClick={() => navigate('/login')} className="btn btn-secondary">Login to Review</button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
            <div className="ai-recommendations-section glass-panel" style={{ padding: '3rem' }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                    <h3 style={{margin: 0, fontSize: '1.8rem'}}>✨ AI Recommended For You</h3>
                    <span style={{fontSize: '0.9rem', background: 'var(--color-secondary)', color: 'white', padding: '4px 12px', borderRadius: '20px'}}>Smart Match</span>
                </div>
                <div className="products-grid">
                    {recommendations.map(rec => (
                        <ProductCard key={rec.id} product={rec} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductDetails;
