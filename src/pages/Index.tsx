import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Truck, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/shared/ProductCard';
import CategoryCard from '@/components/shared/CategoryCard';
import { useProducts, useCategories, useBrands, useBlogPosts } from '@/hooks/useProducts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { data: featuredProducts, isLoading: loadingFeatured } = useProducts({ featured: true, limit: 8 });
  const { data: newProducts, isLoading: loadingNew } = useProducts({ isNew: true, limit: 4 });
  const { data: bestSellers, isLoading: loadingBest } = useProducts({ bestSeller: true, limit: 4 });
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: brands } = useBrands();
  const { data: blogPosts } = useBlogPosts();

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.hero-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });
      gsap.fromTo('.hero-image', { opacity: 0, scale: 0.8, rotateY: 15 }, { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });

      // Features bar
      gsap.fromTo('.feature-item', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 90%' }
      });

      // Section reveals
      gsap.utils.toArray('.section-reveal').forEach((el: any) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const ProductSkeletons = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />
        
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="hero-subtitle inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" /> New Collection 2024
              </span>
              <h1 className="hero-title font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Premium<br />
                <span className="text-gradient">Electronics</span><br />
                Store
              </h1>
              <p className="hero-desc text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Discover cutting-edge technology. From smartphones to accessories, find the perfect device that matches your lifestyle.
              </p>
              <div className="hero-cta flex flex-wrap gap-4">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            <div className="hero-image relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-hero-gradient rounded-3xl opacity-20 blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop"
                  alt="Premium Electronics"
                  className="relative w-full max-w-lg mx-auto rounded-3xl shadow-elevation-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section ref={featuresRef} className="border-y border-border/50 bg-card/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-item flex items-center gap-4 justify-center">
                <div className="p-3 rounded-2xl bg-primary/5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-reveal container py-16 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-4xl font-bold">Popular Categories</h2>
            <p className="text-muted-foreground mt-2">Browse our most popular product categories</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/categories">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        {loadingCats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories?.slice(0, 8).map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Best Deals */}
      <section className="section-reveal bg-secondary/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-4xl font-bold">Best Deals</h2>
              <p className="text-muted-foreground mt-2">Don't miss out on these amazing offers</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          {loadingBest ? <ProductSkeletons /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers?.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="section-reveal container py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-0 bg-hero-gradient text-primary-foreground group cursor-pointer">
            <CardContent className="p-10 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <span className="text-sm font-medium opacity-80">Limited Time Offer</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-3 mb-4">Up to 40% Off Audio</h3>
              <p className="opacity-70 mb-8 max-w-xs">Premium headphones & earbuds at unbeatable prices.</p>
              <Button variant="secondary" asChild className="relative z-10">
                <Link to="/shop?category=headphones">Shop Audio</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 bg-foreground text-background group cursor-pointer">
            <CardContent className="p-10 md:p-12 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <span className="text-sm font-medium opacity-60">New Collection</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-3 mb-4">Smart Watches 2024</h3>
              <p className="opacity-50 mb-8 max-w-xs">Discover the latest wearable technology.</p>
              <Button variant="secondary" asChild className="relative z-10">
                <Link to="/shop?category=watches">Explore Watches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-reveal container py-16 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Handpicked premium products for you</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        {loadingFeatured ? <ProductSkeletons count={8} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts?.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="section-reveal bg-secondary/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-4xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-2">The latest additions to our collection</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          {loadingNew ? <ProductSkeletons /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts?.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="section-reveal container py-16 md:py-20">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-10">Our Brands</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {brands?.slice(0, 16).map(brand => (
            <Link
              key={brand.id}
              to={`/shop?brand=${brand.slug}`}
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="section-reveal bg-secondary/30">
          <div className="container py-16 md:py-20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold">From Our Blog</h2>
                <p className="text-muted-foreground mt-2">Latest news and tech reviews</p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/blog">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts?.slice(0, 3).map(post => (
                <Card key={post.id} className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500 group">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image || '/placeholder.svg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                  <CardContent className="p-6">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{post.category}</span>
                    <h3 className="font-display font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-primary font-medium mt-4 hover:gap-2 transition-all">
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section-reveal container py-16 md:py-20">
        <Card className="border-0 bg-hero-gradient text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <CardContent className="p-10 md:p-16 text-center relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Stay Updated</h2>
            <p className="opacity-70 mb-8 max-w-md mx-auto text-lg">Subscribe for exclusive deals and new product launches.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12" />
              <Button variant="secondary" className="h-12 px-6">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
