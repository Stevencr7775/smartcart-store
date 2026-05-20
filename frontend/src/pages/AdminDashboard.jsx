import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAllOrders, updateOrderStatusAPI } from '../api';
import { toast } from 'react-toastify';
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', category: '', price: '', description: '', imageUrl: '', brand: '', stock: 100 
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchAdminData();
  }, [user, navigate, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + user.token };
      
      if (activeTab === 'analytics') {
          const res = await fetch('http://127.0.0.1:5001/api/admin/analytics', { headers });
          const data = await res.json();
          setStats(data.stats);
          setTransactions(data.transactions || []);
          setInsight(data.insight);
      } else if (activeTab === 'products') {
          const res = await fetch('http://127.0.0.1:5001/api/admin/products', { headers });
          const data = await res.json();
          setProducts(data || []);
      } else if (activeTab === 'orders') {
          const data = await fetchAllOrders(user.token);
          setOrders(data || []);
      }
    } catch (error) {
        console.error("Failed to fetch admin data", error);
        toast.error("Failed to sync dashboard data.");
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
        await updateOrderStatusAPI(orderId, newStatus, user.token);
        toast.success("Order status updated successfully!");
        fetchAdminData();
    } catch (err) {
        toast.error("Failed to update status.");
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', description: '', imageUrl: '', brand: '', stock: 100 });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      brand: product.brand || '',
      stock: product.stock !== undefined ? product.stock : (product.countInStock || 0)
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch('http://127.0.0.1:5001/api/admin/products/' + productId, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + user.token }
      });
      if (res.ok) {
        toast.success("Product deleted successfully!");
        fetchAdminData();
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (err) {
      toast.error("Delete operation failed.");
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? 'http://127.0.0.1:5001/api/admin/products/' + editingProduct.id 
        : 'http://127.0.0.1:5001/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      if (res.ok) {
        toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        setShowModal(false);
        fetchAdminData();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to save product changes.");
      }
    } catch (err) {
      toast.error("Network write failed.");
    }
  };

  const chartData = [...transactions].reverse().map(t => ({
      date: new Date(t.createdAt).toLocaleDateString(),
      revenue: Number(t.totalPrice || t.totalAmount || 0)
  }));

  if(!user || user.role !== 'admin') return null;

  return (
    <div className="admin-dashboard animate-fade-in" style={{ padding: '2rem 5%' }}>
      <div className="admin-header glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h1 className="text-gradient" style={{ margin: 0 }}>Admin Control Panel</h1>
         <div className="admin-tabs" style={{ display: 'flex', gap: '1rem' }}>
            <button className={'tab-btn ' + (activeTab === 'analytics' ? 'active' : '')} onClick={() => setActiveTab('analytics')}>Analytics</button>
            <button className={'tab-btn ' + (activeTab === 'products' ? 'active' : '')} onClick={() => setActiveTab('products')}>Products</button>
            <button className={'tab-btn ' + (activeTab === 'orders' ? 'active' : '')} onClick={() => setActiveTab('orders')}>Orders</button>
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

                      {insight && (
                        <div className="ai-insight-box glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                          <h4 style={{ color: 'var(--color-primary)' }}>✨ AI Business Insight</h4>
                          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>{insight}</p>
                        </div>
                      )}

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
                                      <td style={{ padding: '1rem' }}>{o.userId?.username || o.User?.username || 'Guest'}</td>
                                      <td style={{ padding: '1rem' }}>₹{(o.totalPrice || o.totalAmount || 0).toFixed(2)}</td>
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
                        <button className="btn btn-primary" onClick={openAddModal}>Add Product +</button>
                      </div>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                  <th style={{ padding: '1rem' }}>ID</th>
                                  <th style={{ padding: '1rem' }}>Name</th>
                                  <th style={{ padding: '1rem' }}>Brand</th>
                                  <th style={{ padding: '1rem' }}>Price</th>
                                  <th style={{ padding: '1rem' }}>Stock</th>
                                  <th style={{ padding: '1rem' }}>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {products.map(p => (
                                  <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.id}</td>
                                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.name}</td>
                                      <td style={{ padding: '1rem' }}>{p.brand || 'Generic'}</td>
                                      <td style={{ padding: '1rem' }}>₹{p.price}</td>
                                      <td style={{ padding: '1rem' }}>{p.stock !== undefined ? p.stock : (p.countInStock || 0)}</td>
                                      <td style={{ padding: '1rem', display: 'flex', gap: '8px' }}>
                                          <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => openEditModal(p)}>Edit</button>
                                          <button className="btn delete-btn" style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )
          )}
      </div>

      {/* Floating Product Editor Modal */}
      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content glass-panel animate-fade-in" style={{ background: 'var(--color-bg-main)', color: 'var(--color-text-main)', padding: '30px', borderRadius: '15px', width: '500px', maxWidth: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '20px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Product Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Brand</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Category</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Stock</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Image URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-subtle)', color: 'inherit', resize: 'vertical' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
