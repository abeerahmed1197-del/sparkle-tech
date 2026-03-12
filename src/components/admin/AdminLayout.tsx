import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, FolderTree, Tag, FileText, Ticket, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const adminLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
  { icon: Tag, label: 'Brands', href: '/admin/brands' },
  { icon: FileText, label: 'Blog', href: '/admin/blog' },
  { icon: Ticket, label: 'Coupons', href: '/admin/coupons' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground mb-6">
            <ChevronLeft className="h-4 w-4" /> Back to Store
          </Link>
          <h2 className="font-display text-lg font-bold text-sidebar-primary-foreground">Admin Panel</h2>
        </div>
        <nav className="px-3 space-y-1">
          {adminLinks.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-secondary/30">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-2 p-4 border-b bg-background">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Store</Link>
          <span className="font-display font-bold">Admin</span>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden overflow-x-auto border-b bg-background">
          <div className="flex px-2 py-2 gap-1">
            {adminLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  location.pathname === href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="h-3 w-3" />{label}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
