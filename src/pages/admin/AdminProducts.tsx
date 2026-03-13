import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

const AdminProducts = () => {
  const { data: products, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete product');
    else { toast.success('Product deleted'); queryClient.invalidateQueries({ queryKey: ['products'] }); }
  };

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
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
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs border-0">
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button>
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
    </div>
  );
};

export default AdminProducts;
