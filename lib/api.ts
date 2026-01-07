// API service for website
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aarambh-english-learning-app-1.onrender.com/api';

// Helper function to get stored token
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to set stored token
const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

// Helper function to clear stored token
const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  const token = getStoredToken();
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (response.status === 204 || response.status === 304) {
      if (!response.ok) {
        throw new Error(response.status === 304 ? 'Not modified' : 'No content');
      }
      return { success: true };
    }

    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }
    
    if (!response.ok) {
      if (data && data.message) {
        const error = new Error(data.message);
        (error as any).statusCode = response.status;
        (error as any).errorData = data;
        throw error;
      }
      throw new Error('API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setStoredToken(response.data.token);
    }
    
    return response;
  },

  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'student' | 'teacher';
    region: string;
    referralCode?: string;
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setStoredToken(response.data.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout error (continuing):', error);
    } finally {
      clearStoredToken();
    }
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
};

// Transactions API
export const transactionsAPI = {
  getSubscription: async () => {
    return await apiRequest('/transactions/subscription');
  },

  getAvailablePlans: async () => {
    return await apiRequest('/transactions/plans');
  },

  createOrder: async (orderData: { planId: string; referralCode?: string }) => {
    return await apiRequest('/transactions/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  verifyPayment: async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    transactionId: string;
  }) => {
    return await apiRequest('/transactions/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Referrals API
export const referralsAPI = {
  validateReferralCode: async (data: { referralCode: string; amount: number }) => {
    return await apiRequest('/referrals/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Regions API
export const regionsAPI = {
  getAllRegions: async () => {
    return await apiRequest('/regions');
  },
};

export { getStoredToken, setStoredToken, clearStoredToken };

