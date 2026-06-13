# Variants & Hierarchical Categories

## 1. Database schema (one migration)

**`categories`**: add `parent_id uuid references categories(id) on delete cascade`, index on `(parent_id, slug)`. Existing rows become top-level (parent_id null).

**`product_variants`** (new):
- `product_id` → products
- `color` text nullable, `color_hex` text nullable
- `storage` text nullable (e.g. "128GB")
- `price` numeric NOT NULL
- `discount_price` numeric nullable
- `stock` int default 0
- `sku` text nullable
- `sort_order` int default 0
- unique (`product_id`, `color`, `storage`)

**`product_variant_images`** (new): variant-scoped gallery. Columns: `variant_id`, `url`, `sort_order`. Used to switch gallery when a color is picked. (Falls back to product images when a variant has none.)

**`cart_items`**: add `variant_id uuid references product_variants(id) on delete cascade` nullable. Update unique constraint to `(user_id, product_id, variant_id)`.

**`order_items`**: add `variant_id uuid` nullable, `variant_label text` nullable (snapshot like "Blue · 256GB"), `variant_color text`, `variant_storage text`.

**RLS / grants**: variants & variant_images public-read, admin write (mirrors products/product_images). cart_items / order_items policies unchanged (already scoped by user/order).

## 2. Edge function update

`create-checkout`: when recomputing subtotal, look up price from `product_variants` if `variant_id` is set, else `products`. Snapshot variant label into the Stripe line-item name.

## 3. Admin UI (`AdminProducts.tsx`)

In the product dialog, add a **Variants** section below the existing fields:
- Table of variant rows (color, color_hex picker, storage, price, discount_price, stock, sku).
- "Add variant" button.
- Per-row: upload images for that color (writes to `product_variant_images`, reuses existing `product-images` storage bucket).
- Remove the now-redundant single Color/Memory specification inputs (data migrated into variants if user re-saves).

New admin page **`AdminCategories.tsx`** (route `/admin/categories`, link in sidebar):
- Tree view of categories → subcategories.
- CRUD with parent picker.

## 4. Storefront

**Navigation** (`Navbar.tsx`): replace flat Categories link with a hover/click mega-menu — parent categories as columns, subcategories as links to `/c/{parent}/{child}`.

**Routing** (`App.tsx`):
- `/c/:parentSlug` → category page (all products in parent + its subcategories)
- `/c/:parentSlug/:childSlug` → subcategory page (products in that subcategory only)
- Keep `/shop` for global search/filter.

**`CategoryPage.tsx`** (new): reuses Shop product grid + filters; SEO-friendly `<title>`, `<meta description>`, single `<h1>`, breadcrumb JSON-LD.

**`ProductDetail.tsx`**:
- Load `product_variants` and `product_variant_images`.
- Color swatches (using `color_hex`) + storage chips.
- Selection state determines active variant; price + gallery update reactively (Framer Motion fade for image swap).
- "Add to cart" passes `variant_id`.
- Display selected variant label.

**Cart & Checkout**: show variant label under product name; cart hook + context already store the `variant_id`. Quantity merge key becomes `product_id + variant_id`.

## 5. SEO / a11y

- Subcategory URLs are slugged and lower-case.
- Single H1 per page, descriptive title `<60 chars`, meta description `<160 chars`.
- Variant swatches have `aria-label` + `aria-pressed`.
- Selected state visually distinct (ring + checkmark), not color-only.

## Out of scope

- Per-variant promotions or coupon rules.
- Inventory reservations / oversell protection beyond existing stock field.
- Bulk variant CSV import (admin can add rows manually).

Approve to proceed and I'll ship it in one pass: migration → edge function → admin → storefront.