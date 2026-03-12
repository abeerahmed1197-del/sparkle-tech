import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const OrderSuccess = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-20 text-center max-w-md mx-auto">
      <CheckCircle className="h-20 w-20 mx-auto text-success mb-6" />
      <h1 className="font-display text-3xl font-bold mb-3">Order Placed!</h1>
      <p className="text-muted-foreground mb-8">Thank you for your order. You'll receive a confirmation email shortly.</p>
      <div className="flex gap-3 justify-center">
        <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        <Button variant="outline" asChild><Link to="/dashboard">View Orders</Link></Button>
      </div>
    </div>
    <Footer />
  </div>
);

export default OrderSuccess;
