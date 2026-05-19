import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/admin';

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate(redirect);
    } else if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, user, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(username, password);
    } catch(err) {
        setError(err.message || 'Failed to authenticate admin');
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="auth-container" style={{ borderTop: '4px solid var(--color-primary)' }}>
        <div className="auth-header">
          <h2 style={{ color: 'var(--color-primary)' }}>Admin Portal</h2>
          <p>Restricted access. Authorized personnel only.</p>
        </div>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit" style={{ marginTop: '1rem' }}>Secure Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;