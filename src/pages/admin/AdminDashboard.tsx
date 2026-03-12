import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const stats = [
  { icon: DollarSign, label: 'Revenue', value: '$24,580', change: '+12.5%', color: 'text-success' },
  { icon: ShoppingCart, label: 'Orders', value: '156', change: '+8.2%', color: 'text-primary' },
  { icon: Package, label: 'Products', value: '482', change: '+3.1%', color: 'text-accent' },
  { icon: Users, label: 'Customers', value: '2,847', change: '+15.3%', color: 'text-warning' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: '$299.00', status: 'Processing', date: '2024-02-15' },
  { id: 'ORD-002', customer: 'Jane Smith', total: '$1,149.00', status: 'Shipped', date: '2024-02-14' },
  { id: 'ORD-003', customer: 'Bob Wilson', total: '$89.00', status: 'Delivered', date: '2024-02-13' },
  { id: 'ORD-004', customer: 'Alice Brown', total: '$449.00', status: 'Pending', date: '2024-02-12' },
];

const statusColors: Record<string, string> = {
  Processing: 'bg-primary/10 text-primary',
  Shipped: 'bg-warning/10 text-warning',
  Delivered: 'bg-success/10 text-success',
  Pending: 'bg-muted text-muted-foreground',
};

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <Card key={label} className="border-0 shadow-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-secondary`}><Icon className={`h-5 w-5 ${color}`} /></div>
                <span className="flex items-center text-xs text-success font-medium"><TrendingUp className="h-3 w-3 mr-1" />{change}</span>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{order.id}</td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2 font-medium">{order.total}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
