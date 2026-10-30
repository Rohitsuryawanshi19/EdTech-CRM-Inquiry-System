const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Helper to build headers with custom JWT bearer token if available
 */
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('k12_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic request wrapper with comprehensive error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `HTTP ${response.status}: Request failed`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // Check if network failed or server down
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export const api = {
  // Public: Submit inquiry
  submitInquiry: (payload) => {
    return request('/inquiries', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload),
    });
  },

  // Auth: Custom JWT Login
  login: (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
  },

  // Auth: Verify token & get admin me
  getMe: () => {
    return request('/auth/me', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // Protected: Get inquiries with filters & search
  getInquiries: ({ search = '', category = '', userType = '', status = '', page = 1, limit = 50 } = {}) => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (category && category !== 'All') query.append('category', category);
    if (userType && userType !== 'All') query.append('userType', userType);
    if (status && status !== 'All') query.append('status', status);
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);

    return request(`/inquiries?${query.toString()}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // Protected: Update inquiry status
  updateInquiryStatus: (id, status) => {
    return request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
  },

  // Protected: Delete inquiry
  deleteInquiry: (id) => {
    return request(`/inquiries/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  },

  // Protected: Get statistics
  getStats: () => {
    return request('/inquiries/stats', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },
};

export default api;
