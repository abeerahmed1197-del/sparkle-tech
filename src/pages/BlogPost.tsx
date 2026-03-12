import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/products';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen"><Navbar /><div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold mb-4">Post Not Found</h1><Button asChild><Link to="/blog">Back to Blog</Link></Button></div><Footer /></div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 pb-16 max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-4"><Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></Button>
        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <span className="text-sm text-primary font-medium">{post.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <p className="text-muted-foreground leading-relaxed mt-4">{post.content}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
