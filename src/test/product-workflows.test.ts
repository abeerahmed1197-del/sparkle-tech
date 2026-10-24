import { describe, expect, it, vi } from 'vitest';
import { categoryBrandPath, categorySeo, collectCategoryIds, resolveCategoryRoute } from '@/lib/category-navigation';
import type { CategoryNode } from '@/hooks/useProducts';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
import { canPublishProduct, type EditorForm } from '@/lib/product-drafts';

const node = (id: string, name: string, slug: string, children: CategoryNode[] = []): CategoryNode => ({ id, name, slug, children, icon: null, image: null, parent_id: null, product_count: 0 });
const samsung = { id: 'brand', name: 'Samsung', slug: 'samsung' };
const android = node('android', 'Android', 'android');
const mobiles = node('mobiles', 'Mobiles', 'mobiles', [android]);
const form: EditorForm = { name: 'Phone', slug: 'phone', description: '', short_description: '', price: '100', discount_price: '', stock: '1', sku: '', category_id: '', brand_id: '', is_featured: false, is_new: false, is_best_seller: false };

describe('Nested category and brand rules', () => {
  it('resolves /c/mobiles/android/samsung as a brand inside the nested category', () => {
    const result = resolveCategoryRoute([mobiles], ['mobiles', 'android', 'samsung'], [samsung]);
    expect(result?.node.id).toBe('android');
    expect(result?.brand?.id).toBe('brand');
    expect(result?.trail.map(c => c.name)).toEqual(['Mobiles', 'Android']);
  });
  it('prefers an actual nested Samsung category over a brand of the same slug', () => {
    const category = node('samsung-category', 'Samsung', 'samsung');
    const parent = node('android', 'Android', 'android', [category]);
    expect(resolveCategoryRoute([node('m', 'Mobiles', 'mobiles', [parent])], ['mobiles','android','samsung'], [samsung])?.node.id).toBe('samsung-category');
    expect(categoryBrandPath([mobiles,parent], samsung)).toBe('/c/mobiles/android?brand=samsung');
  });
  it('includes only category IDs from the selected subtree', () => {
    expect(collectCategoryIds(mobiles)).toEqual(['mobiles', 'android']);
    expect(collectCategoryIds(android)).toEqual(['android']);
  });
  it('rejects invalid intermediate path segments', () => {
    expect(resolveCategoryRoute([mobiles], ['mobiles','missing','samsung'], [samsung])).toBeNull();
  });
  it('derives category and brand context without truncating ancestors', () => {
    const seo = categorySeo([mobiles, android], samsung);
    expect(seo.path).toBe('/c/mobiles/android/samsung');
    expect(seo.label).toBe('Samsung Android');
  });
});
describe('Explicit product publishing validation', () => {
  it('permits publishing a complete product with a valid base price', () => expect(canPublishProduct(form, [])).toBe(true));
  it('prevents publishing an incomplete draft', () => expect(canPublishProduct({ ...form, price: '' }, [])).toBe(false));
  it('prevents publishing invalid variant prices and stock', () => {
    const variant = { color: 'Black', color_hex: '', storage: '128GB', price: '-1', discount_price: '', stock: '2', sku: '', sort_order: 0, existingImages: [], newImages: [], _deletedImages: [] };
    expect(canPublishProduct(form, [variant])).toBe(false);
    expect(canPublishProduct(form, [{ ...variant, price: '100', stock: '1.5' }])).toBe(false);
  });
});