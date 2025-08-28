import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { SiteSettings } from './types';

// Create a configurable axios instance
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  async get(path: string, params: any = {}) {
    const response = await axios.get(`${this.baseURL}${path}`, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  }

  async post(path: string, data: any = {}) {
    const response = await axios.post(`${this.baseURL}${path}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  }
}

// Create an instance for general API calls
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add authentication token to requests
apiClient.interceptors.request.use(async (config) => {
  const session: Session | null = await getSession();
  
  // If our session contains an access token, add it to the headers
  if (session?.user && 'accessToken' in session.user) {
    const accessToken = (session.user as any).accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle error responses
    // Improve error handling with better typing
    const axiosError = error as AxiosError;
    let errorMessage = 'An unexpected error occurred';
    
    if (axiosError.response) {
      // Handle server response errors
      const errorData = axiosError.response.data as { error?: string };
      errorMessage = errorData?.error || axiosError.message;
    } else if (axiosError.message) {
      // Handle network errors
      errorMessage = axiosError.message;
    }
    
    // Implement your custom error handling logic here
    // For example, redirect to login on 401
    if (error.response?.status === 401) {
      // Redirect to login page or refresh token
    }
    
    return Promise.reject(errorMessage);
  }
);

// API Service Methods
const apiService = {
  // Auth API
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) => 
    apiClient.post('/auth/register', userData),
  
  // User API
  getUserProfile: () => apiClient.get<{ id: string; name: string; email: string; role: string }>('/user/profile'),
  
  updateUserProfile: (data: { name?: string; email?: string }) => 
    apiClient.patch('/user/profile', data),
  
  // Product API
  getProducts: (params: any) => 
    apiClient.get('/products', { params }),
  
  getProductBySlug: (slug: string) => 
    apiClient.get(`/products/slug/${slug}`),
  
  createProduct: (productData: any) => 
    apiClient.post('/products', productData),
  
  // Order API
  createOrder: (orderData: any) => 
    apiClient.post('/orders', orderData),
  
  getOrderHistory: () => 
    apiClient.get('/orders'),
  
  // Upload API
  getPresignedUrl: (fileData: { filename: string; contentType: string }) => 
    apiClient.post('/uploads/presign', fileData),
  
  completeUpload: (fileData: { uploadId: string; fileKey: string }) => 
    apiClient.post('/uploads/complete', fileData),
  
  // Site Settings
  getSiteSettings: () => apiClient.get<SiteSettings>('/site-settings'),
  
  // Helper function to format errors
  formatError: (error: any) => {
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  }
};

export default apiService;
