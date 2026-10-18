# Project rules
- Product edits are staged in admin-only product drafts and applied through an atomic publish operation, so live products remain unchanged until publication.
- Product editor recovery uses IndexedDB to preserve file attachments without exposing drafts to storefront queries.
- Category navigation and metadata share path-resolution helpers, so nested category and terminal brand URLs stay consistent.
- Quick View loads the live product detail query on demand rather than duplicating listing data.