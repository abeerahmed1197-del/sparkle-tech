import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const dashboardLinks = [
  { icon: Package, label: 'Orders', count: 3 },
  { icon: Heart, label: 'Wishlist', count: 5 },
  { icon: MapPin, label: 'Addresses', count: 2 },
  { icon: Settings, label: 'Settings', count: 0 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 pb-16">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            <Card className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {dashboardLinks.map(({ icon: Icon, label, count }) => (
                    <button key={label} className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                      <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{label}</span>
                      {count > 0 && <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{count}</span>}
                    </button>
                  ))}
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No orders yet. Connect Supabase to view order history.</p>
                    <Button className="mt-4" asChild><Link to="/shop">Start Shopping</Link></Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="mt-6">
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No saved addresses. Add one during checkout.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <p>Account settings will be available after connecting Supabase Auth.</p>
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
