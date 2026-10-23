import { supabase } from '@/integrations/supabase/client';

export interface EditorForm {
  name: string; slug: string; description: string; short_description: string;
  price: string; discount_price: string; stock: string; sku: string;
  category_id: string; brand_id: string; is_featured: boolean; is_new: boolean; is_best_seller: boolean;
}
export interface DraftVariant {
  id?: string; color: string; color_hex: string; storage: string; price: string;
  discount_price: string; stock: string; sku: string; sort_order: number;
  existingImages: { id: string; url: string }[]; newImages: File[]; _deletedImages: string[];
}
export interface EditorSnapshot {
  form: EditorForm; images: { id: string; url: string }[]; imageFiles: File[]; variants: DraftVariant[];
}
export interface ProductDraft {
  id: string; product_id: string | null; title: string; updated_at: string;
  payload: Omit<EditorSnapshot, 'imageFiles'>;
}
export const canPublishProduct = (form: EditorForm, variants: DraftVariant[]) =>
  !!form.name.trim() && !!form.slug.trim() && form.price !== '' && Number.isFinite(Number(form.price)) && Number(form.price) >= 0 &&
  Number.isInteger(Number(form.stock)) && Number(form.stock) >= 0 &&
  variants.every(v => v.price !== '' && Number.isFinite(Number(v.price)) && Number(v.price) >= 0 && Number.isInteger(Number(v.stock)) && Number(v.stock) >= 0);

export async function draftOperation(action: string, params: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke('product-drafts', { body: { action, ...params } });
  if (error) throw new Error('Could not save or publish the draft. Please try again.');
  if (data?.error) throw new Error(data.error);
  return data?.data;
}

// IndexedDB structured cloning preserves File objects across refreshes.
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('emobiles-editor', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('drafts');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function editorRecovery(action: 'read' | 'write' | 'delete', key: string, value?: EditorSnapshot) {
  const db = await database();
  return new Promise<EditorSnapshot | undefined>((resolve, reject) => {
    const tx = db.transaction('drafts', action === 'read' ? 'readonly' : 'readwrite');
    const store = tx.objectStore('drafts');
    const request = action === 'read' ? store.get(key) : action === 'write' ? store.put(value, key) : store.delete(key);
    tx.oncomplete = () => { db.close(); resolve(action === 'read' ? request.result : undefined); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}