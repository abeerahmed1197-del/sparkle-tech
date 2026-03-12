import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categories } from '@/data/categories';
import { brands } from '@/data/categories';

export const AdminCategories = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Categories</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
    </div>
    <Card className="border-0 shadow-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Products</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="py-3 px-4 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{cat.slug}</td>
                  <td className="py-3 px-4">{cat.productCount}</td>
                  <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const AdminBrands = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Brands</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Brand</Button>
    </div>
    <Card className="border-0 shadow-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50"><th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th><th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th></tr></thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="py-3 px-4 font-medium">{brand.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{brand.slug}</td>
                  <td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const AdminCustomers = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Customers</h1>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Customer data will be loaded from Supabase after connecting your project.</CardContent></Card>
  </div>
);

export const AdminBlog = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Blog Posts</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Post</Button>
    </div>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Blog management will be available after connecting Supabase.</CardContent></Card>
  </div>
);

export const AdminCoupons = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Coupons</h1>
      <Button><Plus className="h-4 w-4 mr-2" />Add Coupon</Button>
    </div>
    <Card className="border-0 shadow-card"><CardContent className="p-6 text-center text-muted-foreground">Coupon management will be available after connecting Supabase.</CardContent></Card>
  </div>
);

export const AdminSettings = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Site Settings</h1>
    <Card className="border-0 shadow-card">
      <CardContent className="p-6 space-y-4">
        <div><label className="text-sm font-medium">Store Name</label><Input className="mt-1" defaultValue="TechStore" /></div>
        <div><label className="text-sm font-medium">Support Email</label><Input className="mt-1" defaultValue="support@techstore.com" /></div>
        <div><label className="text-sm font-medium">Free Shipping Threshold ($)</label><Input className="mt-1" type="number" defaultValue="50" /></div>
        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  </div>
);
