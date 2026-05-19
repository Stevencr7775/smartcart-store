import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message.');
      
      toast.success(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="container page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 'var(--spacing-8) 0', maxWidth: '600px', margin: '0 auto' }}
    >
      <h1 style={{ marginBottom: 'var(--spacing-2)', fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-subtle)', marginBottom: 'var(--spacing-6)' }}>
        Have questions or feedback? Send us a message and we'll get back to you at smartcartai7@gmail.com.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', background: 'var(--color-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        
        <div className="form-group">
          <label htmlFor="name" style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold' }}>Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="form-control"
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-background)', color: 'var(--color-text)' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold' }}>Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="form-control"
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-background)', color: 'var(--color-text)' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold' }}>Message</label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows="5"
            className="form-control"
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-background)', color: 'var(--color-text)', resize: 'vertical' }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ padding: '14px', fontSize: '1rem', marginTop: 'var(--spacing-2)' }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </motion.div>
  );
};

export default Contact;