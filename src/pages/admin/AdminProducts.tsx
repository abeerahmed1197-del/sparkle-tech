import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/products';

const AdminProducts = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-display text-2xl font-bold">Products</h1>
      <Button asChild><Link to="/admin/products/add"><Plus className="h-4 w-4 mr-2" />Add Product</Link></Button>
    </div>
    <Card className="border-0 shadow-card mb-6">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Input placeholder="Search products..." className="max-w-sm" />
          <Button variant="outline">Filter</Button>
        </div>
      </CardContent>
    </Card>
    <Card className="border-0 shadow-card">
      <CardContent className="p-0">
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
              {products.map(product => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{product.sku}</td>
                  <td className="py-3 px-4 font-medium">${product.discountPrice ?? product.price}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminProducts;
