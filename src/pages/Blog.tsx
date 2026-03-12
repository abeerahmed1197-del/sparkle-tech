import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/products';

const Blog = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-8 pb-16">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <Card key={post.id} className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all group">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-primary font-medium">{post.category}</span>
                <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-primary font-medium">
                Read More <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default Blog;
