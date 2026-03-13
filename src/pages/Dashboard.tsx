import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/hooks/useProducts';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const Dashboard = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, phone });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10 pb-20">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div>
            <Card className="border-0 shadow-card sticky top-24">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); navigate('/'); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                {ordersLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <Card key={order.id} className="border-0 shadow-card">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-display font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={statusColors[order.status]}>{order.status}</Badge>
                              <span className="font-display font-bold">${order.total}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-card">
                    <CardContent className="p-10 text-center text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                      <p className="text-lg font-display font-semibold mb-2">No orders yet</p>
                      <p className="text-sm mb-4">Start shopping to see your orders here.</p>
                      <Button asChild><Link to="/shop">Start Shopping</Link></Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <Label>Full Name</Label>
                      <Input className="mt-1.5 h-11" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input className="mt-1.5 h-11" value={user.email || ''} disabled />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input className="mt-1.5 h-11" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
