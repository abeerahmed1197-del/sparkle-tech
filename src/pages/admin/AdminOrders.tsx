import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  pending: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminOrders = () => {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error('Failed to update status');
    else { toast.success('Order status updated'); queryClient.invalidateQueries({ queryKey: ['orders'] }); }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map(order => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-secondary/30">
                    <td className="py-3 px-4 font-medium">#{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 font-medium">${order.total}</td>
                    <td className="py-3 px-4">
                      <Badge className={`text-xs ${statusColors[order.status] || ''}`}>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
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
};

export default AdminOrders;
