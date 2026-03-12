import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const orders = [
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', items: 3, total: '$299.00', status: 'processing', date: '2024-02-15' },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', items: 1, total: '$1,149.00', status: 'shipped', date: '2024-02-14' },
  { id: 'ORD-003', customer: 'Bob Wilson', email: 'bob@example.com', items: 2, total: '$89.00', status: 'delivered', date: '2024-02-13' },
  { id: 'ORD-004', customer: 'Alice Brown', email: 'alice@example.com', items: 1, total: '$449.00', status: 'pending', date: '2024-02-12' },
];

const statusColors: Record<string, string> = {
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  pending: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminOrders = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
    <Card className="border-0 shadow-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">
                    <div><p className="font-medium">{order.customer}</p><p className="text-xs text-muted-foreground">{order.email}</p></div>
                  </td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4 font-medium">{order.total}</td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-3 px-4 text-right">
                    <Select defaultValue={order.status}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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

export default AdminOrders;
