import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';
import { useOrders } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-primary/10 text-primary',
  paid: 'bg-success/10 text-success',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminOrders = () => {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error('Failed to update status');
    else { toast.success('Order status updated'); queryClient.invalidateQueries({ queryKey: ['orders'] }); }
  };

  const updateTracking = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ tracking_number: trackingNumber }).eq('id', orderId);
    if (error) toast.error('Failed to update tracking');
    else { toast.success('Tracking number updated'); queryClient.invalidateQueries({ queryKey: ['orders'] }); }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
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
                    <td className="py-3 px-4 text-muted-foreground">{(order as any).order_items?.length || 0}</td>
                    <td className="py-3 px-4 font-medium">${order.total}</td>
                    <td className="py-3 px-4">
                      <Badge className={`text-xs ${statusColors[order.status] || ''}`}>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedOrder(order); setTrackingNumber(order.tracking_number || ''); }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order #{selectedOrder?.id.slice(0, 8)}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge className={statusColors[selectedOrder.status]}>{selectedOrder.status}</Badge></div>
                <div><span className="text-muted-foreground">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                <div><span className="text-muted-foreground">Subtotal:</span> ${selectedOrder.subtotal}</div>
                <div><span className="text-muted-foreground">Shipping:</span> ${selectedOrder.shipping_cost}</div>
                {selectedOrder.discount > 0 && <div><span className="text-muted-foreground">Discount:</span> -${selectedOrder.discount}</div>}
                <div><span className="text-muted-foreground font-semibold">Total:</span> <span className="font-bold">${selectedOrder.total}</span></div>
                {selectedOrder.coupon_code && <div><span className="text-muted-foreground">Coupon:</span> {selectedOrder.coupon_code}</div>}
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product_image && <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        {item.variant_label && <p className="text-xs text-primary">{item.variant_label}</p>}
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tracking Number</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" />
                  <Button size="sm" onClick={() => updateTracking(selectedOrder.id)}>Save</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
