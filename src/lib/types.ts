export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category: string;
  rating: number;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  badge: string | null;
  isPreorder: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  isPreorder: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
};

export type Order = {
  id: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingName: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    unitPriceCents: number;
    quantity: number;
  }>;
};

export function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
