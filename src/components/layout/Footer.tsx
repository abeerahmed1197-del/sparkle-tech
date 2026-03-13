import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="font-display text-2xl font-bold text-background mb-4 block">eMobiles</span>
            <p className="text-sm leading-relaxed mb-6 text-background/60">Your premium destination for mobile phones and electronic accessories. Quality meets innovation.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-xl bg-background/5 hover:bg-background/15 transition-all duration-300 hover:-translate-y-0.5">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-5">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[['Shop', '/shop'], ['Categories', '/categories'], ['Brands', '/brands'], ['Blog', '/blog'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-background transition-colors w-fit">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-5">Customer Service</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[['FAQ', '/faq'], ['Shipping Policy', '/shipping-policy'], ['Returns Policy', '/returns-policy'], ['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms']].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-background transition-colors w-fit">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-5">Newsletter</h4>
            <p className="text-sm mb-4 text-background/60">Get exclusive deals and product launches.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background/5 border-background/10 text-background placeholder:text-background/30 h-10" />
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 h-10 px-4">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-background/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>© {new Date().getFullYear()} eMobiles. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-background/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-background/70 transition-colors">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-background/70 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
