import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { categories } from '@/data/categories';
import { useState } from 'react';
import logo from '@/assets/logo.svg';

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
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Top bar */}
      <div className="bg-foreground text-background text-xs py-1.5">
        <div className="container flex justify-between items-center">
          <p>Free shipping on orders over $50</p>
          <div className="hidden sm:flex gap-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/faq" className="hover:underline">FAQ</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex items-center justify-between h-16 gap-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <nav className="flex flex-col p-6 gap-1">
                <Link to="/" className="mb-6">
                  <img src={logo} alt="Store" className="h-8" />
                </Link>
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href} className="py-3 px-4 rounded-lg hover:bg-secondary font-medium transition-colors">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t mt-4 pt-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2 px-4">Categories</p>
                  {categories.slice(0, 8).map(cat => (
                    <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="py-2 px-4 text-sm rounded-lg hover:bg-secondary block transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Store" className="h-7 md:h-8" />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <Input placeholder="Search products..." className="w-40 md:w-64 h-9" autoFocus onBlur={() => setSearchOpen(false)} />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/auth">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
