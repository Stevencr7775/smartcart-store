const fs = require('fs');
const content = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [insight, setInsight] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [user, navigate, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: \`Bearer \${user.token}\` };
      
      if (activeTab === 'analytics') {
          const res = await fetch('http://127.0.0.1:5001/api/admin/analytics', { headers });
          const data = await res.json();
          setStats(data.stats);
          setTransactions(data.transactions);
          setInsight(data.insight);
      } else if (activeTab === 'products') {
          const res = await fetch('http://127.0.0.1:5001/api/admin/products', { headers });
          const data = await res.json();
          setProducts(data);
      }
    } catch (error) {
        console.error("Failed to fetch admin data", error);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
      if(!window.confirm("Are you sure you want to delete this product?")) return;
      try {
          await fetch(\`http://127.0.0.1:5001/api/admin/products/\${id}\`, {
              method: 'DELETE',
              headers: { Authorization: \`Bearer \${user.token}\` }
          });
          fetchAdminData();
      } catch (err) {
          console.error(err);
      }
  };

  if(!user || user.role !== 'admin') return null;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
         <h2>Admin Control Panel</h2>
         <div className="admin-tabs">
            <button className={\`tab-btn \${activeTab === 'analytics' ? 'active' : ''}\`} onClick={() => setActiveTab('analytics')}>Sales Analytics</button>
            <button className={\`tab-btn \${activeTab === 'products' ? 'active' : ''}\`} onClick={() => setActiveTab('products')}>Product Management</button>
         </div>
      </div>

      <div className="admin-content">
          {loading ? <p>Loading Data...</p> : (
              activeTab === 'analytics' ? (
                  <div className="analytics-view">
                      <div className="stats-grid">
                          <div className="stat-card">
                              <h3>Total Revenue</h3>
                              <p className="stat-value">₹{stats?.totalRevenue.toFixed(2) || 0}</p>
                          </div>
                          <div className="stat-card">
                              <h3>Total Orders</h3>
                              <p className="stat-value">{stats?.totalOrders || 0}</p>
                          </div>
                           <div className="stat-card">
                              <h3>Total Products</h3>
                              <p className="stat-value">{stats?.totalProducts || 0}</p>
                          </div>
                           <div className="stat-card">
                              <h3>Best Seller</h3>
                              <p className="stat-value">{stats?.bestSeller || 'N/A'}</p>
                          </div>
                      </div>

                      <div className="ai-insight-box">
                          <h4>✨ AI Business Insight</h4>
                          <p>{insight}</p>
                      </div>

                      <div className="transactions-list">
                          <h3>Recent Sales Transactions</h3>
                          <table className="admin-table">
                              <thead>
                                  <tr>
                                      <th>Order ID</th>
                                      <th>Product</th>
                                      <th>Quantity</th>
                                      <th>Total Price</th>
                                      <th>Date</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {transactions.map(t => (
                                      <tr key={t.id}>
                                          <td>#{t.id}</td>
                                          <td>{t.Product ? t.Product.name : 'Unknown Product'}</td>
                                          <td>{t.quantity}</td>
                                          <td>₹{t.totalPrice.toFixed(2)}</td>
                                          <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              ) : (
                  <div className="products-view">
                      <div className="products-actions">
                          <button className="btn btn-primary">Add New Product +</button>
                      </div>
                      <table className="admin-table">
                           <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Name</th>
                                      <th>Category</th>
                                      <th>Price</th>
                                      <th>Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {products.map(p => (
                                      <tr key={p.id}>
                                          <td>{p.id}</td>
                                          <td>{p.name}</td>
                                          <td>{p.category}</td>
                                          <td>₹{p.price.toFixed(2)}</td>
                                          <td>
                                              <button className="btn btn-secondary action-btn">Edit</button>
                                              <button className="btn btn-secondary action-btn delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                      </table>
                  </div>
              )
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
\`;
fs.writeFileSync('AdminDashboard.jsx', content);
console.log('Fixed syntax and unicode errors');
