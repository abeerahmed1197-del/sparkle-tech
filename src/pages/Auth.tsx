import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (signupPassword !== signupConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signUp(signupEmail, signupPassword, signupName);
      toast.success('Account created! Check your email to verify.');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-16 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1.5 h-11" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input className="mt-1.5 h-11" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button className="w-full h-11" onClick={handleLogin} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input className="mt-1.5 h-11" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1.5 h-11" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input className="mt-1.5 h-11" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input className="mt-1.5 h-11" type="password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} placeholder="••••••••" />
                </div>
                <Button className="w-full h-11" onClick={handleSignup} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
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
