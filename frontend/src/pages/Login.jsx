import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(email, password);
        // Navigation handled by useEffect
    } catch(err) {
        setError(err.message || 'Failed to login');
        toast.error(err.message || 'Failed to login');
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your personalized shopping experience.</p>
        </div>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit">Sign In</button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button className="btn btn-social">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="social-icon" />
          Google
        </button>

                <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0 }}>
            Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Sign up</Link>
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
            Are you an administrator? <Link to="/admin/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
