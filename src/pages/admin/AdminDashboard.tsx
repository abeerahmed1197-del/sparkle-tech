import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useProducts, useOrders } from '@/hooks/useProducts';

const AdminDashboard = () => {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;

  const stats = [
    { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-success' },
    { icon: ShoppingCart, label: 'Orders', value: String(totalOrders), color: 'text-primary' },
    { icon: Package, label: 'Products', value: String(totalProducts), color: 'text-accent' },
    { icon: Users, label: 'Customers', value: '—', color: 'text-warning' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-secondary"><Icon className={`h-5 w-5 ${color}`} /></div>
              </div>
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-card">
        <CardContent className="p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Recent Orders</h3>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-2 font-medium">${order.total}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{order.status}</span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
