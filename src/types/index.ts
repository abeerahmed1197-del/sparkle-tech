export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brandId: string;
  categoryId: string;
  images: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string | null;
  colorHex: string | null;
  storage: string | null;
  price: number;
  discountPrice: number | null;
  stock: number;
  sku: string | null;
  sortOrder: number;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
  parentId?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface CartItem {
  id: string; // composite: `${productId}::${variantId ?? ''}`
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variantId?: string | null;
  variantLabel?: string | null;
  variantColor?: string | null;
  variantStorage?: string | null;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export const variantLabel = (v?: ProductVariant | null) => {
  if (!v) return '';
  return [v.color, v.storage].filter(Boolean).join(' · ');
};

export const cartLineId = (productId: string, variantId?: string | null) =>
  `${productId}::${variantId ?? ''}`;

export const effectivePrice = (product: Product, variant?: ProductVariant | null) => {
  if (variant) return variant.discountPrice ?? variant.price;
  return product.discountPrice ?? product.price;
};
