import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  categories: { id: string; name: string; slug: string; icon: string | null; image: string | null } | null;
}

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
          categories(id, name, slug, icon, image)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }
      if (filters?.bestSeller) {
        query = query.eq('is_best_seller', true);
      }
      if (filters?.isNew) {
        query = query.eq('is_new', true);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by category/brand slug in JS since we need to join
      let results = (data as unknown as ProductWithImages[]) || [];
      if (filters?.categorySlug) {
        results = results.filter(p => p.categories?.slug === filters.categorySlug);
      }
      if (filters?.brandSlug) {
        results = results.filter(p => p.brands?.slug === filters.brandSlug);
      }

      return results;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(id, url, sort_order),
          brands(id, name, slug, logo),
          categories(id, name, slug, icon, image)
        `)
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as unknown as ProductWithImages;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
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
