import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Category } from '../services/apiConfig';

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  categoryId: number;
  category: string;
  description: string;
  seller: string;
  isNew?: boolean;
  discount?: number;
  stock: number;
  images: string[];
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  seller: string;
}

// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   icon: string;
//   productCount?: number;
// }

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  filters: {
    categoryId: number | null;
    priceRange: [number, number];
    rating: number;
    searchQuery: string;
    sortBy: string;
  };
  isLoading: boolean;
  darkMode: boolean;
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload:Category[] }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  products: [],
  categories: [],
  cart: [],
  orders: [],
  filters: {
    categoryId: null,
    priceRange: [0, 10000],
    rating: 0,
    searchQuery: '',
    sortBy: 'popularity',
  },
  isLoading: false,
  darkMode: false,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        orders: [],
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing auth on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({ type: 'SET_USER', payload: parsedUser });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } catch  {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};