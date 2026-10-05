// API Client for DeaWeb E-commerce Frontend
// Matches the NestJS backend API at /api prefix

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    credentials: 'include', // Important for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================
// Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category: string;
  rating?: number;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  badge?: string;
  isPreorder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  isPreorder: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  featured?: boolean;
  bestseller?: boolean;
  preorder?: boolean;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
}

export interface CreateProductDto {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category: string;
  rating?: number;
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  badge?: string;
  isPreorder?: boolean;
}

export interface AddCartItemDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface MergeCartDto {
  items: AddCartItemDto[];
}

export interface CheckoutDto {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

export interface NewsletterSubscribeDto {
  email: string;
}

// ============================================
// API Functions
// ============================================

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<User>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => request<{ ok: true }>('/auth/logout', { method: 'POST' }),

  me: () => request<User>('/auth/me'),
};

// Products
export const productsApi = {
  list: (query: ProductQuery = {}) => request<Product[]>('/products', { params: query }),

  getBySlug: (slug: string) => request<Product>(`/products/${slug}`),

  create: (data: CreateProductDto) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
};

// Cart
export const cartApi = {
  get: () => request<CartItem[]>('/cart'),

  addItem: (data: AddCartItemDto) =>
    request<CartItem[]>('/cart/items', { method: 'POST', body: JSON.stringify(data) }),

  updateItem: (productId: string, data: UpdateCartItemDto) =>
    request<CartItem[]>(`/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  removeItem: (productId: string) =>
    request<CartItem[]>(`/cart/items/${productId}`, { method: 'DELETE' }),

  merge: (data: MergeCartDto) =>
    request<CartItem[]>('/cart/merge', { method: 'POST', body: JSON.stringify(data) }),

  clear: () => request<CartItem[]>('/cart', { method: 'DELETE' }),
};

// Orders
export const ordersApi = {
  list: () => request<Order[]>('/orders'),

  get: (id: string) => request<Order>(`/orders/${id}`),

  checkout: (data: CheckoutDto) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
};

// Newsletter
export const newsletterApi = {
  subscribe: (email: string) =>
    request<{ ok: true }>('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};

// Health
export const healthApi = {
  check: () => request<{ ok: true }>('/health'),
};

// ============================================
// Utility Functions
// ============================================

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function getCategoryLabel(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}