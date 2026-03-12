import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Truck, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/shared/ProductCard';
import CategoryCard from '@/components/shared/CategoryCard';
import { products } from '@/data/products';
import { categories, brands } from '@/data/categories';
import { blogPosts } from '@/data/products';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const heroSlides = [
  {
    title: 'The Future of Mobile',
    subtitle: 'iPhone 15 Pro Max',
    description: 'Titanium. A17 Pro chip. A camera that captures your wildest imagination.',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
    bg: 'from-primary/5 to-accent/5',
  },
];

const Index = () => {
  const featuredProducts = products.filter(p => p.isFeatured);
  const newProducts = products.filter(p => p.isNew);
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-background">
        <div className="container py-12 md:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="h-4 w-4" /> New Arrival
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {heroSlides[0].title}
              </h1>
              <p className="text-xl md:text-2xl font-display font-semibold text-muted-foreground mb-2">
                {heroSlides[0].subtitle}
              </p>
              <p className="text-muted-foreground mb-8 max-w-md">
                {heroSlides[0].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroSlides[0].image}
                alt="Featured Product"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-elevation-3"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y bg-background">
        <div className="container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 justify-center">
                <div className="p-2 rounded-xl bg-primary/10">
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
      <section className="container py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Popular Categories</h2>
            <p className="text-muted-foreground mt-1">Browse our most popular product categories</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/categories">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.slice(0, 8).map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Best Deals */}
      <section className="bg-surface">
        <div className="container py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Best Deals</h2>
              <p className="text-muted-foreground mt-1">Don't miss out on these amazing offers</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop?sort=discount">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-0 bg-hero-gradient text-primary-foreground">
            <CardContent className="p-8 md:p-10">
              <span className="text-sm font-medium opacity-80">Limited Time Offer</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-3">Up to 40% Off Audio</h3>
              <p className="opacity-80 mb-6">Premium headphones & earbuds at unbeatable prices.</p>
              <Button variant="secondary" asChild>
                <Link to="/shop?category=headphones">Shop Audio</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-foreground to-foreground/80 text-background">
            <CardContent className="p-8 md:p-10">
              <span className="text-sm font-medium opacity-80">New Collection</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-3">Smart Watches 2024</h3>
              <p className="opacity-80 mb-6">Discover the latest wearable technology.</p>
              <Button variant="secondary" asChild>
                <Link to="/shop?category=watches">Explore Watches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Handpicked premium products for you</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop?featured=true">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-surface">
        <div className="container py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-1">The latest additions to our collection</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop?sort=newest">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="container py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Our Brands</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {brands.slice(0, 12).map(brand => (
            <Link
              key={brand.id}
              to={`/shop?brand=${brand.slug}`}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="bg-surface">
        <div className="container py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">From Our Blog</h2>
              <p className="text-muted-foreground mt-1">Latest news and tech reviews</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/blog">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <Card key={post.id} className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all group">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <CardContent className="p-5">
                  <span className="text-xs text-primary font-medium">{post.category}</span>
                  <h3 className="font-display font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-primary font-medium mt-3 hover:gap-2 transition-all">
                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-12 md:py-16">
        <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
            <p className="opacity-80 mb-6 max-w-md mx-auto">Subscribe to our newsletter for exclusive deals and new product launches.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
