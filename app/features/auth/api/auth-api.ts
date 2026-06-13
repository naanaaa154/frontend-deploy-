import type { AuthCredentials, User } from '../types';

const API_URL = 'http://localhost:8000/api'; // Sesuaikan dengan config backend

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<{ access_token: string; token_type: string }> => {
    // Menggunakan x-www-form-urlencoded untuk OAuth2 standard login endpoint di FastAPI
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // OAuth2 expects 'username'
    formData.append('password', credentials.password);

    const response = await fetch(`${API_URL}/auth/token`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  },

  register: async (data: any): Promise<User> => {
    const response = await fetch(`${API_URL}/users/`, { // Sesuaikan endpoint register backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
    }

    return response.json();
  },

  getMe: async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  }
};
