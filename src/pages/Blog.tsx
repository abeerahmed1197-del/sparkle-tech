import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useBlogPosts } from '@/hooks/useProducts';

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10 pb-20">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Blog</h1>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.id} className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500 group">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image || '/placeholder.svg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <CardContent className="p-6">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">{post.category}</span>
                  <h3 className="font-display font-semibold text-lg mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-primary font-medium mt-4">
                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-muted-foreground">No blog posts yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
