import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Product, ProductVariant, CartItem, cartLineId, effectivePrice } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapVariant } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'emobiles_guest_cart_v2';

const saveGuestCart = (items: CartItem[]) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const loadGuestCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const productFromRow = (p: any): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description || '',
  shortDescription: p.short_description || '',
  price: Number(p.price),
  discountPrice: p.discount_price !== null && p.discount_price !== undefined ? Number(p.discount_price) : undefined,
  stock: p.stock,
  sku: p.sku || '',
  brandId: p.brand_id || '',
  categoryId: p.category_id || '',
  images: p.product_images?.map((i: any) => i.url) || [],
  specifications: p.specifications || {},
  rating: p.rating,
  reviewCount: p.review_count,
  isFeatured: p.is_featured,
  isNew: p.is_new,
  isBestSeller: p.is_best_seller,
  createdAt: p.created_at,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadGuestCart);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (user && prevUserId.current !== user.id) {
      prevUserId.current = user.id;
      (async () => {
        setLoading(true);
        const { data: dbItems } = await (supabase as any)
          .from('cart_items')
          .select('product_id, variant_id, quantity')
          .eq('user_id', user.id);

        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          for (const gi of guestItems) {
            const existing = (dbItems || []).find(
              (d: any) => d.product_id === gi.product.id && (d.variant_id || null) === (gi.variant?.id || null),
            );
            if (existing) {
              await (supabase as any).from('cart_items')
                .update({ quantity: existing.quantity + gi.quantity })
                .eq('user_id', user.id)
                .eq('product_id', gi.product.id)
                .eq('variant_id', gi.variant?.id ?? null);
            } else {
              await (supabase as any).from('cart_items').insert({
                user_id: user.id,
                product_id: gi.product.id,
                variant_id: gi.variant?.id ?? null,
                quantity: gi.quantity,
              });
            }
          }
          localStorage.removeItem(GUEST_CART_KEY);
        }

        const { data: fullCart } = await (supabase as any)
          .from('cart_items')
          .select(`
            product_id, variant_id, quantity,
            products(*, product_images(id, url, sort_order)),
            product_variants(*, product_variant_images(id, url, sort_order))
          `)
          .eq('user_id', user.id);

        if (fullCart) {
          const mapped: CartItem[] = (fullCart as any[])
            .filter(ci => ci.products)
            .map(ci => {
              const variant = ci.product_variants ? mapVariant(ci.product_variants) : null;
              const product = productFromRow(ci.products);
              return {
                id: cartLineId(product.id, variant?.id),
                product,
                variant,
                quantity: ci.quantity,
              };
            });
          setItems(mapped);
        }
        setLoading(false);
      })();
    } else if (!user) {
      prevUserId.current = null;
      setItems(loadGuestCart());
    }
  }, [user]);

  const syncToDb = useCallback(async (productId: string, variantId: string | null, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      let q = (supabase as any).from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
      q = variantId ? q.eq('variant_id', variantId) : q.is('variant_id', null);
      await q;
      return;
    }
    let lookup = (supabase as any).from('cart_items').select('id').eq('user_id', user.id).eq('product_id', productId);
    lookup = variantId ? lookup.eq('variant_id', variantId) : lookup.is('variant_id', null);
    const { data: existing } = await lookup.maybeSingle();
    if (existing) {
      await (supabase as any).from('cart_items').update({ quantity }).eq('id', existing.id);
    } else {
      await (supabase as any).from('cart_items').insert({
        user_id: user.id, product_id: productId, variant_id: variantId, quantity,
      });
    }
  }, [user]);

  const addToCart = useCallback((product: Product, quantity = 1, variant: ProductVariant | null = null) => {
    const lineId = cartLineId(product.id, variant?.id);
    setItems(prev => {
      const existing = prev.find(item => item.id === lineId);
      let newItems: CartItem[];
      if (existing) {
        const newQty = existing.quantity + quantity;
        newItems = prev.map(item => item.id === lineId ? { ...item, quantity: newQty } : item);
        syncToDb(product.id, variant?.id ?? null, newQty);
      } else {
        newItems = [...prev, { id: lineId, product, variant, quantity }];
        syncToDb(product.id, variant?.id ?? null, quantity);
      }
      if (!user) saveGuestCart(newItems);
      return newItems;
    });
    toast.success(`${product.name} added to cart`);
  }, [user, syncToDb]);

  const removeFromCart = useCallback((lineId: string) => {
    setItems(prev => {
      const target = prev.find(i => i.id === lineId);
      const newItems = prev.filter(i => i.id !== lineId);
      if (target) syncToDb(target.product.id, target.variant?.id ?? null, 0);
      if (!user) saveGuestCart(newItems);
      return newItems;
    });
    toast.info('Item removed from cart');
  }, [user, syncToDb]);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(lineId); return; }
    setItems(prev => {
      const target = prev.find(i => i.id === lineId);
      const newItems = prev.map(i => i.id === lineId ? { ...i, quantity } : i);
      if (target) syncToDb(target.product.id, target.variant?.id ?? null, quantity);
      if (!user) saveGuestCart(newItems);
      return newItems;
    });
  }, [removeFromCart, user, syncToDb]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) await (supabase as any).from('cart_items').delete().eq('user_id', user.id);
    localStorage.removeItem(GUEST_CART_KEY);
  }, [user]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + effectivePrice(item.product, item.variant) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export type { CartItem };
