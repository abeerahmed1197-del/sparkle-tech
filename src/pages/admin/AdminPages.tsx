import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCategories, useBrands, useAllBlogPosts, useCoupons } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ========== CATEGORIES ==========
export const AdminCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '', image: '' });

  const handleSave = async () => {
    const data = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), icon: form.icon || null, image: form.image || null };
    if (editId) {
      const { error } = await supabase.from('categories').update(data).eq('id', editId);
      if (error) { toast.error('Failed to update'); return; }
    } else {
      const { error } = await supabase.from('categories').insert(data);
      if (error) { toast.error('Failed to create'); return; }
    }
    toast.success(editId ? 'Category updated' : 'Category created');
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    toast.success('Category deleted');
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const openEdit = (cat: any) => { setEditId(cat.id); setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '', image: cat.image || '' }); setShowDialog(true); };
  const openAdd = () => { setEditId(null); setForm({ name: '', slug: '', icon: '', image: '' }); setShowDialog(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Products</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {categories?.map(cat => (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{cat.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cat.slug}</td>
                      <td className="py-3 px-4">{cat.product_count}</td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent><DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} /></div>
            <div><Label>Slug</Label><Input className="mt-1" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>Icon (emoji or text)</Label><Input className="mt-1" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} /></div>
            <div><Label>Image URL</Label><Input className="mt-1" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} /></div>
          </div>
          <Button className="mt-4 w-full" onClick={handleSave} disabled={!form.name}>{editId ? 'Update' : 'Create'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ========== BRANDS ==========
export const AdminBrands = () => {
  const { data: brands, isLoading } = useBrands();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', logo: '' });

  const handleSave = async () => {
    const data = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), logo: form.logo || null };
    if (editId) await supabase.from('brands').update(data).eq('id', editId);
    else await supabase.from('brands').insert(data);
    toast.success(editId ? 'Brand updated' : 'Brand created');
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('brands').delete().eq('id', id);
    toast.success('Brand deleted'); queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  const openEdit = (b: any) => { setEditId(b.id); setForm({ name: b.name, slug: b.slug, logo: b.logo || '' }); setShowDialog(true); };
  const openAdd = () => { setEditId(null); setForm({ name: '', slug: '', logo: '' }); setShowDialog(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Brands</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Brand</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {brands?.map(brand => (
                    <tr key={brand.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{brand.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{brand.slug}</td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(brand)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(brand.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent><DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Brand</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} /></div>
            <div><Label>Slug</Label><Input className="mt-1" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>Logo URL</Label><Input className="mt-1" value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))} /></div>
          </div>
          <Button className="mt-4 w-full" onClick={handleSave} disabled={!form.name}>{editId ? 'Update' : 'Create'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ========== CUSTOMERS ==========
export const AdminCustomers = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setProfiles(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Customers</h1>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {loading ? <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th></tr></thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{p.full_name || '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{p.phone || '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ========== BLOG ==========
export const AdminBlog = () => {
  const { data: posts, isLoading } = useAllBlogPosts();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', image: '', category: '', author: '', is_published: false });

  const handleSave = async () => {
    const data = {
      title: form.title, slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: form.excerpt || null, content: form.content || null, image: form.image || null,
      category: form.category || null, author: form.author || null, is_published: form.is_published,
    };
    if (editId) await supabase.from('blog_posts').update(data).eq('id', editId);
    else await supabase.from('blog_posts').insert(data);
    toast.success(editId ? 'Post updated' : 'Post created');
    queryClient.invalidateQueries({ queryKey: ['all_blog_posts'] });
    queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Post deleted'); queryClient.invalidateQueries({ queryKey: ['all_blog_posts'] });
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content || '', image: p.image || '', category: p.category || '', author: p.author || '', is_published: p.is_published });
    setShowDialog(true);
  };
  const openAdd = () => { setEditId(null); setForm({ title: '', slug: '', excerpt: '', content: '', image: '', category: '', author: '', is_published: false }); setShowDialog(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Blog Posts</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Post</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {posts?.map(post => (
                    <tr key={post.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{post.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{post.category || '—'}</td>
                      <td className="py-3 px-4"><Badge variant={post.is_published ? 'default' : 'secondary'} className="text-xs border-0">{post.is_published ? 'Published' : 'Draft'}</Badge></td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Blog Post</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input className="mt-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} /></div>
            <div><Label>Slug</Label><Input className="mt-1" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label><Input className="mt-1" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              <div><Label>Author</Label><Input className="mt-1" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} /></div>
            </div>
            <div><Label>Image URL</Label><Input className="mt-1" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} /></div>
            <div><Label>Excerpt</Label><Textarea className="mt-1" rows={2} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} /></div>
            <div><Label>Content</Label><Textarea className="mt-1" rows={6} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /><Label>Published</Label></div>
          </div>
          <Button className="mt-4 w-full" onClick={handleSave} disabled={!form.title}>{editId ? 'Update' : 'Create'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ========== COUPONS ==========
export const AdminCoupons = () => {
  const { data: coupons, isLoading } = useCoupons();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true });

  const handleSave = async () => {
    const data: any = {
      code: form.code.toUpperCase(), discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null, is_active: form.is_active,
    };
    if (editId) await supabase.from('coupons').update(data).eq('id', editId);
    else await supabase.from('coupons').insert(data);
    toast.success(editId ? 'Coupon updated' : 'Coupon created');
    queryClient.invalidateQueries({ queryKey: ['coupons'] });
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    toast.success('Coupon deleted'); queryClient.invalidateQueries({ queryKey: ['coupons'] });
  };

  const openEdit = (c: any) => {
    setEditId(c.id);
    setForm({ code: c.code, discount_type: c.discount_type, discount_value: String(c.discount_value), min_order_amount: c.min_order_amount ? String(c.min_order_amount) : '', max_uses: c.max_uses ? String(c.max_uses) : '', expires_at: c.expires_at ? c.expires_at.split('T')[0] : '', is_active: c.is_active });
    setShowDialog(true);
  };
  const openAdd = () => { setEditId(null); setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true }); setShowDialog(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Coupons</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Coupon</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Code</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Discount</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Used</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {coupons?.map(c => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-mono font-medium">{c.code}</td>
                      <td className="py-3 px-4">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                      <td className="py-3 px-4">{c.used_count || 0}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                      <td className="py-3 px-4"><Badge variant={c.is_active ? 'default' : 'secondary'} className="text-xs border-0">{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent><DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Coupon</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Code</Label><Input className="mt-1 font-mono uppercase" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.discount_type} onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div><Label>Value</Label><Input className="mt-1" type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Min Order ($)</Label><Input className="mt-1" type="number" value={form.min_order_amount} onChange={e => setForm(p => ({ ...p, min_order_amount: e.target.value }))} /></div>
              <div><Label>Max Uses</Label><Input className="mt-1" type="number" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} /></div>
            </div>
            <div><Label>Expires At</Label><Input className="mt-1" type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <Button className="mt-4 w-full" onClick={handleSave} disabled={!form.code || !form.discount_value}>{editId ? 'Update' : 'Create'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ========== SETTINGS ==========
export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="flex gap-2 mb-6">
        {['general', 'payments'].map(tab => (
          <Button key={tab} variant={activeTab === tab ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(tab)} className="capitalize">{tab}</Button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-6 space-y-4">
            <div><Label>Store Name</Label><Input className="mt-1" defaultValue="eMobiles" /></div>
            <div><Label>Support Email</Label><Input className="mt-1" defaultValue="support@emobiles.com" /></div>
            <div><Label>Free Shipping Threshold ($)</Label><Input className="mt-1" type="number" defaultValue="50" /></div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-lg">Stripe Payments</h3>
                  <p className="text-sm text-muted-foreground mt-1">Accept credit card payments via Stripe. Payments go directly to your Stripe account.</p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">Not configured</Badge>
              </div>
              <div className="space-y-4">
                <div><Label>Publishable Key</Label><Input className="mt-1 font-mono text-xs" placeholder="pk_live_..." /></div>
                <div><Label>Secret Key</Label><Input className="mt-1 font-mono text-xs" type="password" placeholder="sk_live_..." /><p className="text-xs text-muted-foreground mt-1">Stored securely as an environment secret.</p></div>
                <div><Label>Webhook Secret</Label><Input className="mt-1 font-mono text-xs" type="password" placeholder="whsec_..." /></div>
                <div className="flex items-center gap-3 pt-2"><input type="checkbox" id="stripe-enabled" className="rounded border-input" /><label htmlFor="stripe-enabled" className="text-sm font-medium">Enable Stripe payments</label></div>
              </div>
              <Button>Save Payment Settings</Button>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold mb-2">How it works</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Create a <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe account</a>.</li>
                <li>Copy API keys from Stripe Dashboard → Developers → API keys.</li>
                <li>Set up a webhook and paste the signing secret above.</li>
                <li>Enable payments and go live.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
