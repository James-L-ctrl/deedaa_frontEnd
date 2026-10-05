import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../lib/api';
import type { CartItem, Product } from '../../lib/types';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'deedaa_guest_cart';

function readGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
    quantity,
    stock: product.stock,
    isPreorder: product.isPreorder,
  };
}

function validateQuantity(product: Pick<Product, 'name' | 'stock' | 'isPreorder'>, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new Error('Choose a quantity between 1 and 20.');
  }
  if (!product.isPreorder && quantity > product.stock) {
    throw new Error(`Only ${product.stock} ${product.stock === 1 ? 'item is' : 'items are'} available.`);
  }
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (user) {
      const next = await api.get<CartItem[]>('/api/cart');
      setItems(next);
      return;
    }
    setItems(readGuestCart());
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const sync = async () => {
      setLoading(true);
      try {
        if (user) {
          const guest = readGuestCart();
          if (guest.length) {
            await api.post('/api/cart/merge', {
              items: guest.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            });
            writeGuestCart([]);
          }
          await refresh();
        } else {
          setItems(readGuestCart());
        }
      } catch {
        setItems(user ? [] : readGuestCart());
      } finally {
        setLoading(false);
      }
    };

    void sync();
  }, [authLoading, user, refresh]);

  const addToCart = async (product: Product, quantity = 1) => {
    const current = user ? items : readGuestCart();
    const existing = current.find((item) => item.productId === product.id);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    validateQuantity(product, nextQty);

    if (user) {
      const next = await api.post<CartItem[]>('/api/cart/items', {
        productId: product.id,
        quantity,
      });
      setItems(next);
      return;
    }

    const next = existing
      ? current.map((item) =>
          item.productId === product.id ? { ...toCartItem(product, nextQty) } : item,
        )
      : [...current, toCartItem(product, quantity)];
    writeGuestCart(next);
    setItems(next);
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      const next = await api.delete<CartItem[]>(`/api/cart/items/${productId}`);
      setItems(next);
      return;
    }
    const next = readGuestCart().filter((item) => item.productId !== productId);
    writeGuestCart(next);
    setItems(next);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    const item = items.find((entry) => entry.productId === productId);
    if (item) {
      validateQuantity(item, quantity);
    }
    if (user) {
      const next = await api.patch<CartItem[]>(`/api/cart/items/${productId}`, { quantity });
      setItems(next);
      return;
    }
    const next = readGuestCart().map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    writeGuestCart(next);
    setItems(next);
  };

  const value = useMemo(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      refresh,
    }),
    [items, loading, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
