import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div 
      className="container page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 'var(--spacing-8) 0', maxWidth: '800px', margin: '0 auto' }}
    >
      <h1 style={{ marginBottom: 'var(--spacing-6)', fontSize: '2.5rem', color: 'var(--color-primary)' }}>Privacy Policy</h1>
      
      <div style={{ lineHeight: '1.8', color: 'var(--color-text)' }}>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>1. Information We Collect</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          At SmartCart, we collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>2. How We Use Your Information</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          We may use the information we collect about you to:
          <ul style={{ paddingLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-2)' }}>
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process and complete transactions, and send you related information.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Personalize your experience through our AI recommendation engine.</li>
          </ul>
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>3. Information Sharing</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          We do not share your personal information with third parties without your consent, except in the following circumstances: with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with any applicable law.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>4. Security</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet transmission is ever fully secure or error free.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>5. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us via our Contact page or directly at smartcartai7@gmail.com.
        </p>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;