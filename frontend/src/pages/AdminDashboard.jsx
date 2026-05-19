import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAllOrders, updateOrderStatusAPI } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [insight, setInsight] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', category: '', price: '', description: '', imageUrl: '', brand: '', countInStock: 0, specifications: '' 
  });

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
      const headers = { Authorization: `Bearer ${user.token}` };
      
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
      } else if (activeTab === 'orders') {
          const data = await fetchAllOrders(user.token);
          setOrders(data);
      }
    } catch (error) {
        console.error("Failed to fetch admin data", error);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
        await updateOrderStatusAPI(orderId, newStatus, user.token);
        fetchAdminData();
    } catch (err) {
        alert("Failed to update status");
    }
  };

  const chartData = [...transactions].reverse().map(t => ({
      date: new Date(t.createdAt).toLocaleDateString(),
      revenue: Number(t.totalPrice)
  }));

  if(!user || user.role !== 'admin') return null;

  return (
    <div className="admin-dashboard animate-fade-in" style={{ padding: '2rem 5%' }}>
      <div className="admin-header glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h1 className="text-gradient" style={{ margin: 0 }}>Admin Control Panel</h1>
         <div className="admin-tabs" style={{ display: 'flex', gap: '1rem' }}>
            <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
            <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
         </div>
      </div>

      <div className="admin-content">
          {loading ? <div style={{textAlign: 'center', padding: '5rem'}}>Loading dashboard data...</div> : (
              activeTab === 'analytics' ? (
                  <div className="analytics-view">
                      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                          <div className="stat-card glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ margin: 0, opacity: 0.7 }}>Total Revenue</p>
                              <h2 style={{ margin: '0.5rem 0' }}>₹{stats?.totalRevenue?.toFixed(2) || 0}</h2>
                          </div>
                          <div className="stat-card glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ margin: 0, opacity: 0.7 }}>Total Orders</p>
                              <h2 style={{ margin: '0.5rem 0' }}>{stats?.totalOrders || 0}</h2>
                          </div>
                          <div className="stat-card glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ margin: 0, opacity: 0.7 }}>Products</p>
                              <h2 style={{ margin: '0.5rem 0' }}>{stats?.totalProducts || 0}</h2>
                          </div>
                          <div className="stat-card glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ margin: 0, opacity: 0.7 }}>Best Seller</p>
                              <h2 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{stats?.bestSeller || 'N/A'}</h2>
                          </div>
                      </div>

                      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3>Revenue Trends</h3>
                        <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                              <YAxis stroke="var(--color-text-muted)" />
                              <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)' }} />
                              <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="var(--color-primary)" strokeWidth={3} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                  </div>
              ) : activeTab === 'orders' ? (
                  <div className="orders-view glass-panel" style={{ padding: '2rem' }}>
                      <h3 style={{ marginBottom: '1.5rem' }}>All Customer Orders</h3>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                  <th style={{ padding: '1rem' }}>Order ID</th>
                                  <th style={{ padding: '1rem' }}>Customer</th>
                                  <th style={{ padding: '1rem' }}>Total</th>
                                  <th style={{ padding: '1rem' }}>Status</th>
                                  <th style={{ padding: '1rem' }}>Date</th>
                                  <th style={{ padding: '1rem' }}>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {orders.map(o => (
                                  <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                      <td style={{ padding: '1rem' }}>#{o.id}</td>
                                      <td style={{ padding: '1rem' }}>{o.User?.username || 'Guest'}</td>
                                      <td style={{ padding: '1rem' }}>₹{o.totalPrice.toFixed(2)}</td>
                                      <td style={{ padding: '1rem' }}>
                                          <span style={{ 
                                              padding: '4px 10px', 
                                              borderRadius: '20px', 
                                              fontSize: '0.8rem', 
                                              background: 'rgba(255,255,255,0.1)',
                                              border: '1px solid var(--glass-border)'
                                          }}>{o.status}</span>
                                      </td>
                                      <td style={{ padding: '1rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                      <td style={{ padding: '1rem' }}>
                                          <select 
                                            value={o.status} 
                                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', background: 'var(--color-bg-subtle)', color: 'inherit', border: '1px solid var(--glass-border)' }}
                                          >
                                              <option value="Pending">Pending</option>
                                              <option value="Processing">Processing</option>
                                              <option value="Shipped">Shipped</option>
                                              <option value="Delivered">Delivered</option>
                                              <option value="Cancelled">Cancelled</option>
                                          </select>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              ) : (
                  <div className="products-view glass-panel" style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3>Manage Inventory</h3>
                        <button className="btn btn-primary">Add Product +</button>
                      </div>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                  <th style={{ padding: '1rem' }}>ID</th>
                                  <th style={{ padding: '1rem' }}>Name</th>
                                  <th style={{ padding: '1rem' }}>Price</th>
                                  <th style={{ padding: '1rem' }}>Stock</th>
                                  <th style={{ padding: '1rem' }}>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {products.map(p => (
                                  <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                      <td style={{ padding: '1rem' }}>{p.id}</td>
                                      <td style={{ padding: '1rem' }}>{p.name}</td>
                                      <td style={{ padding: '1rem' }}>₹{p.price}</td>
                                      <td style={{ padding: '1rem' }}>{p.countInStock}</td>
                                      <td style={{ padding: '1rem' }}>
                                          <button className="btn btn-secondary" style={{ padding: '4px 12px' }}>Edit</button>
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
