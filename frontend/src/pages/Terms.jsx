import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <motion.div 
      className="container page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 'var(--spacing-8) 0', maxWidth: '800px', margin: '0 auto' }}
    >
      <h1 style={{ marginBottom: 'var(--spacing-6)', fontSize: '2.5rem', color: 'var(--color-primary)' }}>Terms and Conditions</h1>
      
      <div style={{ lineHeight: '1.8', color: 'var(--color-text)' }}>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          By accessing and using SmartCart ("the Application", "We", "Us", or "Our"), you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>2. Use of the Site</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
          <ul style={{ paddingLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-2)' }}>
            <li>In any way that violates any applicable national or international law.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
          </ul>
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>3. Product Purchases</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          All purchases through our site or other transactions for the sale of goods formed through the Application, or resulting from visits made by you, are governed by our Terms of Sale.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>4. AI Assistant Disclaimer</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          SmartCart utilizes artificial intelligence to provide product recommendations and answer queries. While we strive for accuracy, the AI's responses are generated based on available data and may occasionally be inaccurate. You should verify important information independently before making purchasing decisions.
        </p>

        <h3 style={{ marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-3)' }}>5. Limitation of Liability</h3>
        <p style={{ marginBottom: 'var(--spacing-4)' }}>
          In no event will SmartCart, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Application.
        </p>
      </div>
    </motion.div>
  );
};

export default Terms;