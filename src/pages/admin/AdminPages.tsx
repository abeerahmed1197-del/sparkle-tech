import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCategories, useBrands } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const AdminCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Category deleted'); queryClient.invalidateQueries({ queryKey: ['categories'] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Products</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {categories?.map(cat => (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{cat.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cat.slug}</td>
                      <td className="py-3 px-4">{cat.product_count}</td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3 w-3" /></Button></div></td>
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

export const AdminBrands = () => {
  const { data: brands, isLoading } = useBrands();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Brand deleted'); queryClient.invalidateQueries({ queryKey: ['brands'] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Brands</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Brand</Button>
      </div>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {brands?.map(brand => (
                    <tr key={brand.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{brand.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{brand.slug}</td>
                      <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(brand.id)}><Trash2 className="h-3 w-3" /></Button></div></td>
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

export const AdminCustomers = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Customers</h1>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Customer management — view registered users and their orders.</CardContent></Card>
  </div>
);

export const AdminBlog = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Blog Posts</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Post</Button>
    </div>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Blog management — create and edit blog posts.</CardContent></Card>
  </div>
);

export const AdminCoupons = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Coupons</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Coupon</Button>
    </div>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Coupon management — create discount codes for your customers.</CardContent></Card>
  </div>
);

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="flex gap-2 mb-6">
        {['general', 'payments'].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-6 space-y-4">
            <div><label className="text-sm font-medium">Store Name</label><Input className="mt-1" defaultValue="eMobiles" /></div>
            <div><label className="text-sm font-medium">Support Email</label><Input className="mt-1" defaultValue="support@emobiles.com" /></div>
            <div><label className="text-sm font-medium">Free Shipping Threshold ($)</label><Input className="mt-1" type="number" defaultValue="50" /></div>
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
                <div>
                  <label className="text-sm font-medium">Publishable Key</label>
                  <Input className="mt-1 font-mono text-xs" placeholder="pk_live_..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Secret Key</label>
                  <Input className="mt-1 font-mono text-xs" type="password" placeholder="sk_live_..." />
                  <p className="text-xs text-muted-foreground mt-1">Stored securely as an environment secret. Never exposed to the client.</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Webhook Secret</label>
                  <Input className="mt-1 font-mono text-xs" type="password" placeholder="whsec_..." />
                  <p className="text-xs text-muted-foreground mt-1">Used to verify webhook events from Stripe.</p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="stripe-enabled" className="rounded border-input" />
                  <label htmlFor="stripe-enabled" className="text-sm font-medium">Enable Stripe payments</label>
                </div>
              </div>
              <Button>Save Payment Settings</Button>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold mb-2">How it works</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Create a <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe account</a> if you don't have one.</li>
                <li>Copy your API keys from the Stripe Dashboard → Developers → API keys.</li>
                <li>Set up a webhook endpoint pointing to your Edge Function and paste the signing secret above.</li>
                <li>Enable payments and customers can pay via Stripe Checkout.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
