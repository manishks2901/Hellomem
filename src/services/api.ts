import axios from 'axios';
import { GET_ALL_PRODUCTS, GET_PRODUCT_DETAIL } from './apiConfig';

// Base API configuration
const API_BASE_URL = 'https://api.Hellomem.com/api'; 
// Replace with your actual .NET API URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses for demo purposes
const mockResponses = {
  // Auth
  '/auth/login': {
    success: true,
    token: 'mock-jwt-token-12345',
    user: {
      id: 1,
      email: 'demo@user.com',
      name: 'Demo User',
      phone: '+91 9876543210'
    }
  },

  // Categories
  '/categories': [
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱' },
    { id: 2, name: 'Fashion', slug: 'fashion', icon: '👕' },
    { id: 3, name: 'Home & Garden', slug: 'home', icon: '🏠' },
    { id: 4, name: 'Beauty', slug: 'beauty', icon: '💄' },
    { id: 5, name: 'Sports', slug: 'sports', icon: '⚽' },
    { id: 6, name: 'Books', slug: 'books', icon: '📚' }
  ],

  '/categories/popular': [
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱', productCount: 1250 },
    { id: 2, name: 'Fashion', slug: 'fashion', icon: '👕', productCount: 2340 },
    { id: 3, name: 'Home & Garden', slug: 'home', icon: '🏠', productCount: 890 }
  ],

  // Products
  '/products': [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 2999,
      originalPrice: 4999,
      rating: 4.5,
      reviews: 1250,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      categoryId: 1,
      category: 'Electronics',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      seller: 'TechStore',
      isNew: true,
      discount: 40,
      stock: 25,
      images: [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=500'
      ]
    },
    {
      id: 2,
      name: 'Stylish Summer Dress',
      price: 1599,
      originalPrice: 2999,
      rating: 4.2,
      reviews: 890,
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500',
      categoryId: 2,
      category: 'Fashion',
      description: 'Elegant summer dress perfect for casual and formal occasions.',
      seller: 'FashionHub',
      discount: 47,
      stock: 15,
      images: [
        'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500'
      ]
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      price: 4999,
      originalPrice: 7999,
      rating: 4.7,
      reviews: 2340,
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
      categoryId: 1,
      category: 'Electronics',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
      seller: 'FitTech',
      isNew: true,
      discount: 38,
      stock: 8,
      images: [
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500'
      ]
    }
  ],

  // Orders
  '/orders': [
    {
      id: 1001,
      orderDate: '2024-01-15T10:30:00Z',
      status: 'Delivered',
      total: 5998,
      items: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          price: 2999,
          quantity: 2,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
      ],
      shippingAddress: {
        name: 'Demo User',
        address: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }
    },
    {
      id: 1002,
      orderDate: '2024-01-10T14:20:00Z',
      status: 'Shipped',
      total: 1599,
      items: [
        {
          id: 2,
          name: 'Stylish Summer Dress',
          price: 1599,
          quantity: 1,
          image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
      ],
      shippingAddress: {
        name: 'Demo User',
        address: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }
    }
  ]
};

// Mock API function
const mockApiCall = (endpoint: string, method: string = 'GET', data?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Handle authentication
      if (endpoint === '/auth/login' && method === 'POST') {
        if (data.email === 'demo@user.com' && data.password === 'demo123') {
          resolve({ data: mockResponses['/auth/login'] });
        } else {
          reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
        }
        return;
      }

      // Handle other endpoints
      // const mockData = mockResponses[endpoint as keyof typeof mockResponses];
      // if (mockData) {
      //   resolve({ data: mockData });
      // } else {
      //   reject({ response: { status: 404, data: { message: 'Endpoint not found' } } });
      // }
    }, 500); // Simulate network delay
  });
};

// API functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    mockApiCall('/auth/login', 'POST', credentials),
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

export const categoriesAPI = {
  getAll: () => mockApiCall('/categories'),
  getPopular: () => mockApiCall('/categories/popular')
};

// export const productsAPI = {
//   getAll: () => GET_ALL_PRODUCTS(),
//   getById: (id: string) => {
//     const product = GET_PRODUCT_DETAIL(id)
//     return Promise.resolve({ data: product });
//   },
//   getPopular: () => {
//     const products = mockResponses['/products'].slice(0, 6);
//     return Promise.resolve({ data: products });
//   },
//   getRecent: () => {
//     const products = mockResponses['/products'].filter((p: any) => p.isNew);
//     return Promise.resolve({ data: products });
//   }
// };

export const cartAPI = {
  add: (productId: number, quantity: number = 1) =>
    Promise.resolve({ data: { success: true } }),
  update: (productId: number, quantity: number) =>
    Promise.resolve({ data: { success: true } }),
  remove: (productId: number) =>
    Promise.resolve({ data: { success: true } })
};

export const ordersAPI = {
  getAll: () => mockApiCall('/orders'),
  create: (orderData: any) =>
    Promise.resolve({ data: { orderId: Date.now(), success: true } })
};

export const contactAPI = {
  submit: (data: any) =>
    Promise.resolve({ data: { success: true, message: 'Message sent successfully' } })
};

export default api;