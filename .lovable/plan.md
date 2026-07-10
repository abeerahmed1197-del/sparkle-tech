# Plan: 7 storefront & admin enhancements

## 1. Rich text for product descriptions
- Add TipTap editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-underline`) with a toolbar: bold, italic, underline, headings, lists, links, images, alignment.
- Paste from web preserves formatting (TipTap default; keep HTML paste, strip only scripts).
- Store as HTML strings in existing `short_description` / `description` columns (no schema change).
- Render on ProductDetail with `dangerouslySetInnerHTML` inside a scoped `.prose` container styled via Tailwind Typography plugin.
- Images pasted as data-URLs get auto-uploaded to `product-images` bucket.

## 2. Product preview before publishing
- In AdminProducts dialog, add a "Preview" button that opens a full-screen `Sheet`/`Dialog` rendering the real `ProductDetail` layout with current form state (no DB write).
- Extract ProductDetail's view into a `ProductView` component that accepts a product object prop so both live route and preview reuse it.

## 3. Hamburger menu on tablets
- Change Navbar breakpoints: hamburger visible below `xl` (currently `lg`), desktop nav shows at `xl:flex`.

## 4. Multi-level nested categories (unlimited depth)
- DB already has `parent_id` self-reference — extend UI only.
- Update `useCategoryTree` to build recursively.
- AdminCategories: render tree recursively with "Add Subcategory" on every node.
- Routing: add catch-all route `/c/*` that walks the slug path (e.g. `/c/mobiles/android/samsung`) and resolves the deepest category.

## 5. Remove category hover dropdown
- Navbar "Categories" becomes a plain link to `/categories` — no hover panel.

## 6. Brand-scoped browsing inside a category
- On `/c/:slug` category page, if products have multiple brands, show a brand grid first (logos + names) plus "All Brands" tile.
- Selecting a brand navigates to `/c/:slug?brand=<slug>` filtering products by brand within that category subtree.
- Product form already links a brand + category, so no schema change.

## 7. Admin-editable hero image
- New table `site_settings` (key/value JSON) OR simpler: reuse existing pattern — create `hero_settings` row with `image_url`, `headline`, `subheadline`, `cta_label`, `cta_href`.
- Admin: new "Homepage" tab under Settings with image uploader (to `product-images` bucket, `hero/` prefix) and text fields.
- HeroSection reads from Supabase via a `useHeroSettings` hook, falls back to current defaults.

## Technical notes
- Migration adds `site_settings` table (jsonb value) with admin-only write RLS, public read.
- Adds `@tiptap/*` and `@tailwindcss/typography` deps.
- No breaking changes to existing product data — descriptions currently plain text render fine as HTML.

Approve to proceed?
