import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12 max-w-md mx-auto">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 space-y-4">
                <div><Label>Email</Label><Input className="mt-1" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input className="mt-1" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></div>
                <Button className="w-full" onClick={() => toast.info('Connect Supabase to enable authentication')}>Login</Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="#" className="text-primary hover:underline">Forgot password?</Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input className="mt-1" /></div>
                  <div><Label>Last Name</Label><Input className="mt-1" /></div>
                </div>
                <div><Label>Email</Label><Input className="mt-1" type="email" /></div>
                <div><Label>Password</Label><Input className="mt-1" type="password" /></div>
                <div><Label>Confirm Password</Label><Input className="mt-1" type="password" /></div>
                <Button className="w-full" onClick={() => toast.info('Connect Supabase to enable authentication')}>Create Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
