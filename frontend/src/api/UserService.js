import axios from 'axios';
import getBaseUrl from '../utils/BaseUrl.js';
import { getAuthHeader } from '../utils/SessionHandler.js';

const API_BASE_URL = getBaseUrl();

// Create axios instance with minimal config to avoid CORS preflight
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Use JSON content type for most API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate axios instance for authenticated requests
const authenticatedClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and adding auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Add auth header if token exists
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for authenticated requests
authenticatedClient.interceptors.request.use(
  (config) => {
    // Add authorization header if available
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Response interceptor for authenticated requests
authenticatedClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class UserService {
  static async makeRequest(config) {
    try {
      console.log('UserService.makeRequest:', config);
      const token = sessionStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios(config);
      console.log('UserService.makeRequest response:', response.data);
      return response.data;
    } catch (error) {
      console.error('UserService.makeRequest error:', error);
      throw new Error(error.response?.data?.detail || error.message);
    }
  }

  static async login(credentials) {
    try {
      console.log('UserService.login called with:', credentials);
      
      // Backend uses OAuth2PasswordRequestForm which expects:
      // - username: User's email address (despite the field name being 'username')
      // - password: User's password
      const formData = new URLSearchParams();
      formData.append('username', credentials.username); // Email goes in 'username' field
      formData.append('password', credentials.password);
      
      console.log('Sending form data:', formData.toString());
      console.log('Using base URL:', API_BASE_URL);
      console.log('apiClient baseURL:', apiClient.defaults.baseURL);
      
      // Use the apiClient instance with form-encoded content type
      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      console.log('UserService.login response:', response);
      return response.data;
    } catch (error) {
      
      // Better error message handling
      let errorMessage = 'Login failed';
      if (error.response?.data) {
        
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          // Handle detail field which might be an array or string
          const detail = error.response.data.detail;
          
          if (Array.isArray(detail)) {
            // Extract error messages from array of validation errors
            const errorMessages = detail.map(err => {
              console.log('Processing error item:', err);
              if (typeof err === 'string') {
                return err;
              } else if (err.msg) {
                return err.msg;
              } else if (err.message) {
                return err.message;
              } else {
                return JSON.stringify(err);
              }
            });
            errorMessage = errorMessages.join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else {
            errorMessage = JSON.stringify(detail);
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join(', ');
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).join(', ');
          } else {
            errorMessage = JSON.stringify(errors);
          }
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      
      console.log('Final error message:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async signup(userData) {
    try {
      console.log('UserService.signup called with:', userData);
      const response = await authenticatedClient.post('/users/signup', userData);
      console.log('UserService.signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('UserService.signup error:', error);
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  }

  static async getCurrentUser() {
    console.log('UserService.getCurrentUser called');
    return this.makeRequest({
      method: 'GET',
      url: '/users/me'
    });
  }

  static async uploadResume(formData) {
    console.log('UserService.uploadResume called with data:', formData);
    return this.makeRequest({
      method: 'POST',
      url: '/users/resume',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  static async parseResume(formData) {
    console.log('UserService.parseResume called');
    return this.makeRequest({
      method: 'POST',
      url: '/users/resume/parse',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  static async getRecommendations() {
    console.log('UserService.getRecommendations called');
    return this.makeRequest({
      method: 'GET',
      url: '/recommendations/match_courses'
    });
  }
}

export default UserService; 