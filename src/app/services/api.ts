// API Client for backend communication

// When running as a native Android/iOS app via Capacitor, relative paths
// don't resolve to the Express server. Detect native platform and use
// the PC's LAN IP directly. In the browser (dev), Vite proxies /api → localhost:5000.
const isNative = typeof (window as any).Capacitor !== 'undefined'
  && (window as any).Capacitor.isNativePlatform?.();

const BACKEND_URL = 'http://10.110.11.13:5000';
const API_BASE = isNative ? `${BACKEND_URL}/api` : '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_) {
      // JSON parsing failed, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const api = {
  // Auth API
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async signup(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(name: string, email: string) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, email }),
    });
    return handleResponse(res);
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return handleResponse(res);
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Image Verification API
  async verifyImage(imageContent: string, fileName: string, metadata?: any) {
    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ image: imageContent, fileName, metadata }),
    });
    return handleResponse(res);
  },

  // History API
  async getHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getScanDetails(id: string) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async deleteScan(id: string) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/history/clear`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications API
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async markNotificationsAsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Feedback API
  async sendFeedback(rating: number, message: string, type: string = 'General') {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating, message, type }),
    });
    return handleResponse(res);
  },
};
