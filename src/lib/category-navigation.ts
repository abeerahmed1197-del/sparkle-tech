import type { CategoryNode } from '@/hooks/useProducts';

export interface CategoryBrand { id: string; name: string; slug: string; logo?: string | null }
export function resolveCategoryRoute(roots: CategoryNode[], segments: string[], brands: CategoryBrand[]) {
  let list = roots;
  const trail: CategoryNode[] = [];
  let brand: CategoryBrand | null = null;
  for (let i = 0; i < segments.length; i++) {
    const node = list.find(c => c.slug === segments[i]);
    if (node) { trail.push(node); list = node.children; continue; }
    if (i === segments.length - 1 && trail.length) {
      brand = brands.find(b => b.slug === segments[i]) || null;
      if (brand) break;
    }
    return null;
  }
  const node = trail[trail.length - 1];
  return node ? { node, trail, brand } : null;
}
export function collectCategoryIds(node: CategoryNode): string[] {
  return [node.id, ...node.children.flatMap(collectCategoryIds)];
}
export function categoryBrandPath(trail: CategoryNode[], brand?: CategoryBrand | null) {
  const base = `/c/${trail.map(c => encodeURIComponent(c.slug)).join('/')}`;
  // A real child category takes precedence over a brand with the same slug.
  return brand ? (trail[trail.length - 1]?.children.some(c => c.slug === brand.slug)
    ? `${base}?brand=${encodeURIComponent(brand.slug)}` : `${base}/${encodeURIComponent(brand.slug)}`) : base;
}
export function categorySeo(trail: CategoryNode[], brand: CategoryBrand | null) {
  const leaf = trail[trail.length - 1];
  const names = [...trail.map(c => c.name), ...(brand && leaf?.name !== brand.name ? [brand.name] : [])];
  const label = brand ? `${brand.name}${leaf?.name === brand.name ? '' : ` ${leaf?.name || ''}`}` : leaf?.name || 'Categories';
  return {
    title: `${names.join(' · ')} | eMobiles`,
    description: `Shop ${label} at eMobiles. Explore products, compare prices, and choose available colors and storage options.`,
    path: categoryBrandPath(trail, brand), label,
  };
}