import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--spacing-12) var(--spacing-4)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-6)', color: 'var(--color-primary)' }}>About SmartCart</h1>
      
      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-3)' }}>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          At SmartCart, we believe shopping should be an intelligent, seamless, and deeply personalized experience. 
          By combining artificial intelligence with a meticulously curated product catalog, we aim to deliver the 
          future of e-commerce directly to you.
        </p>
      </section>

      <section style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-3)' }}>AI Integration</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          Our platform leverages cutting-edge Machine Learning models and Python microservices to track behavioral 
          patterns, intelligently manage our recommendation engine, and predict the products you need before you even search 
          for them. The <span style={{ color: 'var(--color-primary)' }}>Trending Products</span> detection algorithm runs 
          in real-time to bring you the best items globally.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-12)' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Experience SmartCart</Link>
      </div>
    </div>
  );
};

export default About;
