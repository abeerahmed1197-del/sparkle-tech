import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="min-h-screen"><Navbar /><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div><Footer /></div>;
  if (!post) return <div className="min-h-screen"><Navbar /><div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold mb-4">Post Not Found</h1><Button asChild><Link to="/blog">Back to Blog</Link></Button></div><Footer /></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10 pb-20 max-w-3xl">
        {post.image && <div className="aspect-video rounded-2xl overflow-hidden mb-8"><img src={post.image} alt={post.title} className="w-full h-full object-cover" /></div>}
        <span className="text-xs text-primary font-semibold uppercase tracking-wider">{post.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">By {post.author} · {new Date(post.created_at).toLocaleDateString()}</p>
        <div className="prose max-w-none text-foreground leading-relaxed">
          {post.content?.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
