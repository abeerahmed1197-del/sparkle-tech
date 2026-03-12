import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const About = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-12 pb-16 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">About TechStore</h1>
      <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
        We're passionate about bringing you the best in mobile technology and electronic accessories at competitive prices.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: '10K+', desc: 'Happy Customers' },
          { title: '500+', desc: 'Products Available' },
          { title: '45+', desc: 'Premium Brands' },
        ].map(({ title, desc }) => (
          <Card key={desc} className="border-0 shadow-card text-center">
            <CardContent className="p-8">
              <p className="font-display text-3xl font-bold text-primary">{title}</p>
              <p className="text-muted-foreground mt-1">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 space-y-6 text-muted-foreground leading-relaxed">
        <p>Founded with a mission to make premium technology accessible, TechStore offers a curated selection of mobile phones, smartwatches, audio products, and accessories from the world's top brands.</p>
        <p>We believe in quality, authenticity, and exceptional customer service. Every product is sourced directly from authorized distributors to ensure you receive genuine products with full warranty coverage.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
