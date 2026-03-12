import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold text-background mb-4">TechStore</h3>
            <p className="text-sm leading-relaxed mb-4">Your one-stop shop for premium mobile phones and electronic accessories.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[['Shop', '/shop'], ['Categories', '/categories'], ['Brands', '/brands'], ['Blog', '/blog'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-background transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">Customer Service</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[['FAQ', '/faq'], ['Shipping Policy', '/shipping-policy'], ['Returns Policy', '/returns-policy'], ['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms']].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-background transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Get the latest deals and updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background/10 border-background/20 text-background placeholder:text-background/40 h-9" />
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© 2024 TechStore. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-background/80">Privacy</Link>
            <Link to="/terms" className="hover:text-background/80">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-background/80">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
