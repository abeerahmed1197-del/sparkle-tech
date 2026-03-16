import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useCategories } from '@/hooks/useProducts';
import { useState, useEffect, useRef } from 'react';
import SearchCommand from '@/components/layout/SearchCommand';
import gsap from 'gsap';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: categories } = useCategories();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <header ref={navRef} className="sticky top-0 z-50 glass">
        {/* Top bar */}
        <div className="bg-foreground text-background text-xs py-2">
          <div className="container flex justify-between items-center">
            <p className="font-medium tracking-wide">Free shipping on orders over $50 ✦ Premium Electronics</p>
            <div className="hidden sm:flex gap-4">
              <Link to="/about" className="hover:opacity-80 transition-opacity">About</Link>
              <Link to="/faq" className="hover:opacity-80 transition-opacity">FAQ</Link>
              <Link to="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <nav className="flex flex-col p-6 gap-1">
                  <Link to="/" className="mb-6">
                    <span className="font-display text-xl font-bold text-gradient">eMobiles</span>
                  </Link>
                  {navLinks.map(link => (
                    <Link key={link.href} to={link.href} className="py-3 px-4 rounded-lg hover:bg-secondary font-medium transition-colors">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t mt-4 pt-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-2 px-4">Categories</p>
                    {categories?.slice(0, 8).map(cat => (
                      <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="py-2 px-4 text-sm rounded-lg hover:bg-secondary block transition-colors">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-gradient">eMobiles</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] border-0">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
