import { useEffect, useState, useRef, useMemo } from 'react';
import { Plus, Pencil, Trash2, Loader2, Upload, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAllProducts, useCategories, useBrands } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ProductPreview from '@/components/admin/ProductPreview';
import { useAuth } from '@/context/AuthContext';
import { canPublishProduct, draftOperation, editorRecovery, type EditorSnapshot, type ProductDraft } from '@/lib/product-drafts';
import { useObjectUrls } from '@/hooks/useObjectUrls';

const emptyProduct = {
  name: '', slug: '', description: '', short_description: '', price: '', discount_price: '',
  stock: '0', sku: '', category_id: '', brand_id: '', is_featured: false, is_new: false, is_best_seller: false,
};

interface VariantDraft {
  id?: string;
  color: string;
  color_hex: string;
  storage: string;
  price: string;
  discount_price: string;
  stock: string;
  sku: string;
  sort_order: number;
  existingImages: { id: string; url: string }[];
  newImages: File[];
  _deletedImages: string[];
}

const blankVariant = (i = 0): VariantDraft => ({
  color: '', color_hex: '#000000', storage: '', price: '', discount_price: '',
  stock: '0', sku: '', sort_order: i, existingImages: [], newImages: [], _deletedImages: [],
});

const AdminProducts = () => {
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { user } = useAuth();
  const [drafts, setDrafts] = useState<ProductDraft[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState('');
  const recoveryKey = `${user?.id || 'signed-out'}:${editId || draftId || 'new'}`;
  const latest = useRef<EditorSnapshot>({ form, images: existingImages, imageFiles, variants });
  latest.current = { form, images: existingImages, imageFiles, variants };
  const productImageUrls = useObjectUrls(imageFiles);
  const allVariantFiles = useMemo(() => variants.flatMap(v => v.newImages), [variants]);
  const variantImageUrls = useObjectUrls(allVariantFiles);
  const variantUrls = (index: number) => {
    const offset = variants.slice(0, index).reduce((sum, v) => sum + v.newImages.length, 0);
    return variantImageUrls.slice(offset, offset + variants[index].newImages.length);
  };
  const reloadDrafts = async () => {
    try { setDrafts((await draftOperation('list')) || []); }
    catch { toast.error('Could not load product drafts'); }
  };
  useEffect(() => { if (user) void reloadDrafts(); }, [user?.id]);

  useEffect(() => {
    if (!showDialog || saving || !user) return;
    setAutosaveStatus('Saving on this device…');
    const timer = window.setTimeout(() => {
      void editorRecovery('write', recoveryKey, latest.current)
        .then(() => setAutosaveStatus('Autosaved on this device'))
        .catch(() => setAutosaveStatus('Autosave unavailable — save draft manually'));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [form, existingImages, imageFiles, variants, showDialog, recoveryKey, saving, user]);

  const applySnapshot = (snapshot: EditorSnapshot) => {
    setForm(snapshot.form); setExistingImages(snapshot.images || []);
    setImageFiles(snapshot.imageFiles || []);
    setVariants((snapshot.variants || []).map(v => ({ ...v, newImages: v.newImages || [], _deletedImages: v._deletedImages || [] })));
  };
  const recover = async (key: string, fallback: EditorSnapshot) => {
    try {
      const saved = await editorRecovery('read', key);
      applySnapshot(saved || fallback);
      if (saved) toast.success('Recovered autosaved changes');
    } catch { applySnapshot(fallback); }
    setShowDialog(true);
  };
  const handleDialogChange = (open: boolean) => {
    if (saving) return;
    if (!open && !saving) void editorRecovery('write', recoveryKey, latest.current).catch(() => {});
    setShowDialog(open);
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product and its drafts?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Product deleted'); queryClient.invalidateQueries(); await reloadDrafts(); }
  };
  const openAdd = async () => {
    setEditId(null); setDraftId(null);
    await recover(`${user?.id}:new`, { form: emptyProduct, images: [], imageFiles: [], variants: [] });
  };
  const openDraft = async (draft: ProductDraft) => {
    setEditId(draft.product_id); setDraftId(draft.id);
    await recover(`${user?.id}:${draft.product_id || draft.id}`, { ...draft.payload, imageFiles: [] });
  };
  const openEdit = async (p: any) => {
    const draft = drafts.find(d => d.product_id === p.id);
    if (draft) { await openDraft(draft); return; }
    setEditId(p.id); setDraftId(null);
    const { data: vData, error } = await supabase.from('product_variants')
      .select('*, product_variant_images(id, url, sort_order)').eq('product_id', p.id).order('sort_order');
    if (error) { toast.error('Could not load variants'); return; }
    await recover(`${user?.id}:${p.id}`, {
      form: {
        name: p.name, slug: p.slug, description: p.description || '', short_description: p.short_description || '',
        price: String(p.price), discount_price: p.discount_price != null ? String(p.discount_price) : '',
        stock: String(p.stock), sku: p.sku || '', category_id: p.category_id || '', brand_id: p.brand_id || '',
        is_featured: p.is_featured, is_new: p.is_new, is_best_seller: p.is_best_seller,
      },
      images: p.product_images?.slice().sort((a: any,b: any) => a.sort_order-b.sort_order).map((i: any) => ({ id: i.id, url: i.url })) || [],
      imageFiles: [],
      variants: (vData || []).map((v, i) => ({
        id: v.id, color: v.color || '', color_hex: v.color_hex || '#000000', storage: v.storage || '',
        price: String(v.price), discount_price: v.discount_price != null ? String(v.discount_price) : '',
        stock: String(v.stock), sku: v.sku || '', sort_order: v.sort_order ?? i,
        existingImages: v.product_variant_images.slice().sort((a,b) => a.sort_order-b.sort_order).map(img => ({ id: img.id, url: img.url })),
        newImages: [], _deletedImages: [],
      })),
    });
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updateVariant = (idx: number, patch: Partial<VariantDraft>) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, ...patch } : v));
  };

  const addVariant = () => setVariants(prev => [...prev, blankVariant(prev.length)]);
  const removeVariant = (idx: number) => setVariants(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async (publish = false) => {
    const snapshot = latest.current;
    if (publish && !canPublishProduct(snapshot.form, snapshot.variants)) {
      toast.error('Enter a name, slug, valid prices, and non-negative whole-number stock before publishing'); return;
    }
    setSaving(true);
    try {
      const id = draftId || crypto.randomUUID();
      const upload = async (file: File) => {
        const path = `drafts/${id}/${crypto.randomUUID()}.${file.name.split('.').pop() || 'jpg'}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file);
        if (error) throw new Error('Image upload failed. Your changes are still autosaved.');
        return { id: crypto.randomUUID(), url: supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl };
      };
      const images = [...snapshot.images, ...await Promise.all(snapshot.imageFiles.map(upload))];
      const uploadedVariants = await Promise.all(snapshot.variants.map(async v => ({
        ...v, existingImages: [...v.existingImages, ...await Promise.all(v.newImages.map(upload))],
        newImages: [], _deletedImages: [],
      })));
      const payload = { form: snapshot.form, images, variants: uploadedVariants };
      await draftOperation('save', { id, productId: editId, title: snapshot.form.name || 'Untitled product', payload });
      setDraftId(id); setExistingImages(images); setImageFiles([]); setVariants(uploadedVariants);
      const savedSnapshot = { ...payload, imageFiles: [] };
      latest.current = savedSnapshot;
      await editorRecovery('delete', recoveryKey);
      if (publish) {
        await draftOperation('publish', { id });
        await editorRecovery('delete', `${user?.id}:${editId || id}`);
        setShowDialog(false);
        toast.success('Product published');
      } else {
        await editorRecovery('write', `${user?.id}:${editId || id}`, savedSnapshot);
        setAutosaveStatus('Draft saved');
        toast.success('Draft saved — customer-visible product unchanged');
      }
      await queryClient.invalidateQueries();
      await reloadDrafts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product');
    } finally { setSaving(false); }
  };

  const removeExistingImage = (imgId: string) => {
    setExistingImages(prev => prev.filter(i => i.id !== imgId));
  };

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>
      {drafts.length > 0 && <section className="mb-6">
        <h2 className="font-display text-lg font-semibold mb-3">Drafts</h2>
        <div className="divide-y border-y">
          {drafts.map(d => <div key={d.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0"><p className="font-medium truncate">{d.title || 'Untitled product'}</p>
              <p className="text-xs text-muted-foreground">{d.product_id ? 'Unpublished changes' : 'Not published'} · {new Date(d.updated_at).toLocaleString()}</p></div>
            <div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => openDraft(d)}>Continue editing</Button>
              <Button variant="ghost" size="icon" aria-label="Delete draft" onClick={async () => {
                if (!confirm('Discard this draft? The published product will not change.')) return;
                try { await draftOperation('delete', { id: d.id }); await editorRecovery('delete', `${user?.id}:${d.product_id || d.id}`); await reloadDrafts(); }
                catch { toast.error('Could not delete draft'); }
              }}><Trash2 className="h-4 w-4" /></Button></div>
          </div>)}
        </div>
      </section>}
      <Card className="border-0 shadow-card mb-6">
        <CardContent className="p-4">
          <Input placeholder="Search products..." className="max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </CardContent>
      </Card>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.product_images?.[0]?.url || '/placeholder.svg'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{product.sku || '—'}</td>
                      <td className="py-3 px-4 font-medium">${product.discount_price ?? product.price}</td>
                      <td className="py-3 px-4">
                        <span className={product.stock <= 5 ? 'text-destructive font-medium' : ''}>{product.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs border-0">
                          {product.is_active ? (drafts.some(d => d.product_id === product.id) ? 'Published · Draft changes' : 'Published') : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle><p role="status" className="text-xs text-muted-foreground">{autosaveStatus}</p></DialogHeader>
          <fieldset disabled={saving} className="min-w-0">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label>Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))} /></div>
            <div className="sm:col-span-2"><Label>Slug</Label><Input className="mt-1" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>Base Price ($)</Label><Input className="mt-1" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
            <div><Label>Discount Price ($)</Label><Input className="mt-1" type="number" value={form.discount_price} onChange={e => setForm(p => ({ ...p, discount_price: e.target.value }))} /></div>
            <div><Label>Stock</Label><Input className="mt-1" type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} /></div>
            <div><Label>SKU</Label><Input className="mt-1" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(p => ({ ...p, category_id: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand</Label>
              <Select value={form.brand_id} onValueChange={v => setForm(p => ({ ...p, brand_id: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>{brands?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Short Description</Label>
              <div className="mt-1">
                <RichTextEditor value={form.short_description} onChange={html => setForm(p => ({ ...p, short_description: html }))} placeholder="One-line summary shown in product lists" minHeight={80} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1">Paste from any website — formatting, images, and links are preserved.</p>
              <RichTextEditor value={form.description} onChange={html => setForm(p => ({ ...p, description: html }))} placeholder="Full product description" minHeight={240} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_new} onCheckedChange={v => setForm(p => ({ ...p, is_new: v }))} /><Label>New</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_best_seller} onCheckedChange={v => setForm(p => ({ ...p, is_best_seller: v }))} /><Label>Best Seller</Label></div>
            </div>
          </div>

          {/* Images */}
          <div className="mt-4">
            <Label>Default Images</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {existingImages.map(img => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeExistingImage(img.id)} className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.map((f, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <img src={productImageUrls[i]} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImageFiles(p => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                  const files = e.target.files; if (files) setImageFiles(prev => [...prev, ...Array.from(files)]);
                }} />
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-base">Variants (Color / Storage)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Add color + storage combinations. Each variant can have its own price, stock, and images.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}><Plus className="h-3 w-3 mr-1" />Add Variant</Button>
            </div>
            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-secondary/20">
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    <div className="col-span-2 md:col-span-1">
                      <Label className="text-xs">Color</Label>
                      <Input className="mt-1 h-9" placeholder="Black" value={v.color} onChange={e => updateVariant(idx, { color: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Hex</Label>
                      <Input type="color" className="mt-1 h-9 p-1" value={v.color_hex} onChange={e => updateVariant(idx, { color_hex: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Storage</Label>
                      <Input className="mt-1 h-9" placeholder="128GB" value={v.storage} onChange={e => updateVariant(idx, { storage: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Price</Label>
                      <Input className="mt-1 h-9" type="number" value={v.price} onChange={e => updateVariant(idx, { price: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Discount</Label>
                      <Input className="mt-1 h-9" type="number" value={v.discount_price} onChange={e => updateVariant(idx, { discount_price: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Stock</Label>
                      <Input className="mt-1 h-9" type="number" value={v.stock} onChange={e => updateVariant(idx, { stock: e.target.value })} />
                    </div>
                    <div className="flex items-end gap-1">
                      <div className="flex-1">
                        <Label className="text-xs">SKU</Label>
                        <Input className="mt-1 h-9" value={v.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} />
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeVariant(idx)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs">Variant Images</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {v.existingImages.map(img => (
                        <div key={img.id} className="relative w-16 h-16 rounded-md overflow-hidden border">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => updateVariant(idx, {
                            existingImages: v.existingImages.filter(i => i.id !== img.id),
                            _deletedImages: [...v._deletedImages, img.id],
                          })} className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                      {v.newImages.map((f, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border">
                          <img src={variantUrls(idx)[i]} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => updateVariant(idx, { newImages: v.newImages.filter((_, j) => j !== i) })} className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                          if (e.target.files) updateVariant(idx, { newImages: [...v.newImages, ...Array.from(e.target.files)] });
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              {variants.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No variants. The product will sell at the base price above.</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)} disabled={!form.name}>
              <Eye className="h-4 w-4 mr-2" />Preview
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={saving}>
              Save Draft
            </Button>
            <Button className="flex-1" onClick={() => handleSave(true)} disabled={saving || !canPublishProduct(form, variants)}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Publish
            </Button>
          </div>
          </fieldset>
        </DialogContent>
      </Dialog>

      <ProductPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        product={{
          name: form.name,
          short_description: form.short_description,
          description: form.description,
          price: parseFloat(form.price) || 0,
          discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
          stock: parseInt(form.stock) || 0,
          sku: form.sku,
          categoryName: categories?.find((c: any) => c.id === form.category_id)?.name,
          brandName: brands?.find((b: any) => b.id === form.brand_id)?.name,
          is_new: form.is_new,
          is_featured: form.is_featured,
          is_best_seller: form.is_best_seller,
          images: [
            ...existingImages.map(i => i.url),
            ...productImageUrls,
          ],
          variants: variants.map((v, index) => ({
            color: v.color,
            color_hex: v.color_hex,
            storage: v.storage,
            price: parseFloat(v.price) || 0,
            discount_price: v.discount_price ? parseFloat(v.discount_price) : null,
            stock: parseInt(v.stock) || 0,
            images: [
              ...v.existingImages.map(i => i.url),
              ...variantUrls(index),
            ],
          })),
        }}
      />
    </div>
  );
};

export default AdminProducts;
