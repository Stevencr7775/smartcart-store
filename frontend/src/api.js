let API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = API_URL + '/api';
}

// --- Authentication ---
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to log in');
  return data;
};

export const registerUserAPI = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to register');
  return data;
};

// --- Products ---
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (typeof filters === 'string') {
    if (filters) params.append('keyword', filters);
  } else {
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
  }
  const url = `${API_URL}/products?${params.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
  return data;
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch product');
  return data;
};

// --- Orders ---
export const createOrder = async (orderData, token) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create order');
  return data;
};

export const fetchMyOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders/myorders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};

export const fetchOrderById = async (id, token) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
  return data;
};

// --- AI Chat ---
export const sendChatMessage = async (history) => {
    const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to communicate with AI');
    return data;
}

// --- Reviews ---
export const addReview = async (reviewData, token) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add review');
  return data;
};

export const fetchProductReviews = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/${productId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch reviews');
  return data;
};

// --- AI Recommendations ---
export const fetchRecommendations = async (cartItems) => {
  const response = await fetch(`${API_URL}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch recommendations');
  return data.recommendations;
};

// --- Admin ---
export const fetchAdminAnalytics = async (token) => {
  const response = await fetch(`${API_URL}/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics');
  return data;
};

export const fetchAllOrders = async (token) => {
    const response = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch all orders');
    return data;
};

export const updateOrderStatusAPI = async (id, status, token) => {
    const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
};
