import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAllProducts, useCategories, useBrands } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Product deleted'); queryClient.invalidateQueries({ queryKey: ['all-products'] }); }
  };

  const openAdd = () => {
    setEditId(null); setForm(emptyProduct); setImageFiles([]); setExistingImages([]); setVariants([]); setShowDialog(true);
  };

  const openEdit = async (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description || '', short_description: p.short_description || '',
      price: String(p.price), discount_price: p.discount_price ? String(p.discount_price) : '',
      stock: String(p.stock), sku: p.sku || '', category_id: p.category_id || '', brand_id: p.brand_id || '',
      is_featured: p.is_featured, is_new: p.is_new, is_best_seller: p.is_best_seller,
    });
    setExistingImages(p.product_images?.map((i: any) => ({ id: i.id, url: i.url })) || []);
    setImageFiles([]);

    // Load variants
    const { data: vData } = await (supabase as any)
      .from('product_variants')
      .select('*, product_variant_images(id, url, sort_order)')
      .eq('product_id', p.id)
      .order('sort_order');
    setVariants(((vData as any[]) || []).map((v, i) => ({
      id: v.id,
      color: v.color || '',
      color_hex: v.color_hex || '#000000',
      storage: v.storage || '',
      price: String(v.price),
      discount_price: v.discount_price != null ? String(v.discount_price) : '',
      stock: String(v.stock),
      sku: v.sku || '',
      sort_order: v.sort_order ?? i,
      existingImages: (v.product_variant_images || []).map((img: any) => ({ id: img.id, url: img.url })),
      newImages: [],
      _deletedImages: [],
    })));
    setShowDialog(true);
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updateVariant = (idx: number, patch: Partial<VariantDraft>) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, ...patch } : v));
  };

  const addVariant = () => setVariants(prev => [...prev, blankVariant(prev.length)]);
  const removeVariant = (idx: number) => setVariants(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      const productData: any = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        description: form.description,
        short_description: form.short_description,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        stock: parseInt(form.stock),
        sku: form.sku || null,
        category_id: form.category_id || null,
        brand_id: form.brand_id || null,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_best_seller: form.is_best_seller,
      };

      let productId = editId;

      if (editId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Upload new product images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const ext = file.name.split('.').pop();
        const path = `${productId}/${Date.now()}_${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('product-images').upload(path, file);
        if (uploadErr) { toast.error(`Image upload failed: ${uploadErr.message}`); continue; }
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
        await supabase.from('product_images').insert({
          product_id: productId!,
          url: urlData.publicUrl,
          sort_order: existingImages.length + i,
        });
      }

      // Sync variants
      for (let vi = 0; vi < variants.length; vi++) {
        const v = variants[vi];
        const vRow: any = {
          product_id: productId,
          color: v.color || null,
          color_hex: v.color_hex || null,
          storage: v.storage || null,
          price: parseFloat(v.price || '0'),
          discount_price: v.discount_price ? parseFloat(v.discount_price) : null,
          stock: parseInt(v.stock || '0'),
          sku: v.sku || null,
          sort_order: vi,
        };

        let variantId = v.id;
        if (variantId) {
          const { error } = await (supabase as any).from('product_variants').update(vRow).eq('id', variantId);
          if (error) throw error;
        } else {
          const { data, error } = await (supabase as any).from('product_variants').insert(vRow).select().single();
          if (error) throw error;
          variantId = data.id;
        }

        // Delete removed images
        for (const imgId of v._deletedImages) {
          await (supabase as any).from('product_variant_images').delete().eq('id', imgId);
        }

        // Upload new variant images
        for (let i = 0; i < v.newImages.length; i++) {
          const file = v.newImages[i];
          const ext = file.name.split('.').pop();
          const path = `${productId}/variants/${variantId}/${Date.now()}_${i}.${ext}`;
          const { error: upErr } = await supabase.storage.from('product-images').upload(path, file);
          if (upErr) { toast.error(`Variant image failed: ${upErr.message}`); continue; }
          const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
          await (supabase as any).from('product_variant_images').insert({
            variant_id: variantId,
            url: urlData.publicUrl,
            sort_order: v.existingImages.length + i,
          });
        }
      }

      toast.success(editId ? 'Product updated' : 'Product created');
      queryClient.invalidateQueries({ queryKey: ['all-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
    setSaving(false);
  };

  const removeExistingImage = async (imgId: string) => {
    await supabase.from('product_images').delete().eq('id', imgId);
    setExistingImages(prev => prev.filter(i => i.id !== imgId));
  };

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>
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
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
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
            <div className="sm:col-span-2"><Label>Short Description</Label><Input className="mt-1" value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
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
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImageFiles(p => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                  if (e.target.files) setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
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
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
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

          <Button className="mt-4 w-full" onClick={handleSave} disabled={saving || !form.name || !form.price}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {editId ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
