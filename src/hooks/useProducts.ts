import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ProductVariant } from '@/types';

export interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  sku: string | null;
  brand_id: string | null;
  category_id: string | null;
  specifications: Record<string, string>;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images: { id: string; url: string; sort_order: number }[];
  brands: { id: string; name: string; slug: string; logo: string | null } | null;
  categories: { id: string; name: string; slug: string; icon: string | null; image: string | null; parent_id?: string | null } | null;
  product_variants?: RawVariant[];
}

interface RawVariant {
  id: string;
  product_id: string;
  color: string | null;
  color_hex: string | null;
  storage: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  sku: string | null;
  sort_order: number;
  product_variant_images?: { id: string; url: string; sort_order: number }[];
}

export const mapVariant = (v: RawVariant): ProductVariant => ({
  id: v.id,
  productId: v.product_id,
  color: v.color,
  colorHex: v.color_hex,
  storage: v.storage,
  price: Number(v.price),
  discountPrice: v.discount_price !== null ? Number(v.discount_price) : null,
  stock: v.stock,
  sku: v.sku,
  sortOrder: v.sort_order,
  images:
    (v.product_variant_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url),
});

export const useProducts = (filters?: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images(id, url, sort_order),
          brands(id, name, slug, logo),
          categories(id, name, slug, icon, image, parent_id)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters?.featured) query = query.eq('is_featured', true);
      if (filters?.bestSeller) query = query.eq('is_best_seller', true);
      if (filters?.isNew) query = query.eq('is_new', true);
      if (filters?.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;

      let results = (data as unknown as ProductWithImages[]) || [];
      if (filters?.categorySlug) results = results.filter(p => p.categories?.slug === filters.categorySlug);
      if (filters?.brandSlug) results = results.filter(p => p.brands?.slug === filters.brandSlug);

      return results;
    },
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(id, url, sort_order),
          brands(id, name, slug, logo),
          categories(id, name, slug, icon, image, parent_id)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as unknown as ProductWithImages[]) || [];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('products')
        .select(`
          *,
          product_images(id, url, sort_order),
          brands(id, name, slug, logo),
          categories(id, name, slug, icon, image, parent_id),
          product_variants(*, product_variant_images(id, url, sort_order))
        `)
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as ProductWithImages;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('categories').select('*').order('sort_order').order('name');
      if (error) throw error;
      return data as any[];
    },
  });
};

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  parent_id: string | null;
  product_count: number | null;
  children: CategoryNode[];
}

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['category-tree'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('categories').select('*').order('sort_order').order('name');
      if (error) throw error;
      const all = (data as any[]) || [];
      const byId = new Map<string, CategoryNode>();
      all.forEach(c => byId.set(c.id, { ...c, children: [] }));
      const roots: CategoryNode[] = [];
      byId.forEach(node => {
        if (node.parent_id) {
          const parent = byId.get(node.parent_id);
          if (parent) parent.children.push(node);
          else roots.push(node);
        } else {
          roots.push(node);
        }
      });
      return roots;
    },
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
};

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAllBlogPosts = () => {
  return useQuery({
    queryKey: ['all_blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useShippingMethods = () => {
  return useQuery({
    queryKey: ['shipping_methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('is_active', true)
        .order('price');
      if (error) throw error;
      return data;
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};
