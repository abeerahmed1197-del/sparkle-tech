import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const Contact = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-12 pb-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">Have a question? We'd love to hear from you.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Mail, title: 'Email', info: 'support@techstore.com' },
          { icon: Phone, title: 'Phone', info: '+1 (555) 123-4567' },
          { icon: MapPin, title: 'Address', info: '123 Tech Street, CA 94102' },
        ].map(({ icon: Icon, title, info }) => (
          <Card key={title} className="border-0 shadow-card text-center">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3"><Icon className="h-5 w-5 text-primary" /></div>
              <p className="font-display font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground mt-1">{info}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-0 shadow-card max-w-xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input className="mt-1" /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" /></div>
          </div>
          <div><Label>Subject</Label><Input className="mt-1" /></div>
          <div><Label>Message</Label><Textarea className="mt-1" rows={5} /></div>
          <Button className="w-full" onClick={() => toast.success('Message sent! (Demo)')}>Send Message</Button>
        </CardContent>
      </Card>
    </div>
    <Footer />
  </div>
);

export default Contact;
