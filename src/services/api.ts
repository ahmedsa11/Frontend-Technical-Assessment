import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CreateProductData {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
}

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  },

  create: async (product: CreateProductData): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },
};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>('/auth/login', credentials);
    return response.data;
  },

  signup: async (signupData: SignupData): Promise<{ token: string; user: User }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user: User = {
      id: Date.now(),
      email: signupData.email,
      username: signupData.username,
      token,
    };

    return { token, user };
  },
};

export default api;
