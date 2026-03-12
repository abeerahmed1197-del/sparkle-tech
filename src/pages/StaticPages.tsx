import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const StaticPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-12 pb-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-8">{title}</h1>
      <div className="prose max-w-none text-muted-foreground space-y-4 leading-relaxed">{children}</div>
    </div>
    <Footer />
  </div>
);

export const PrivacyPolicy = () => (
  <StaticPage title="Privacy Policy">
    <p>Last updated: February 2024</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">1. Information We Collect</h2>
    <p>We collect information you provide directly, such as when you create an account, make a purchase, or contact us.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">2. How We Use Your Information</h2>
    <p>We use your information to process orders, improve our services, and communicate with you about products and promotions.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">3. Data Security</h2>
    <p>We implement appropriate security measures to protect your personal information.</p>
  </StaticPage>
);

export const Terms = () => (
  <StaticPage title="Terms & Conditions">
    <p>Last updated: February 2024</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">1. Acceptance of Terms</h2>
    <p>By accessing and using TechStore, you agree to be bound by these terms and conditions.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">2. Products and Pricing</h2>
    <p>All prices are listed in USD. We reserve the right to change prices at any time without notice.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">3. Orders</h2>
    <p>We reserve the right to refuse or cancel any order for any reason.</p>
  </StaticPage>
);

export const ShippingPolicy = () => (
  <StaticPage title="Shipping Policy">
    <p>We offer multiple shipping options to meet your needs.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">Standard Shipping</h2>
    <p>5-7 business days. $5.99 flat rate.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">Express Shipping</h2>
    <p>2-3 business days. $14.99.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">Free Shipping</h2>
    <p>Available on all orders over $50. Delivered in 7-10 business days.</p>
  </StaticPage>
);

export const ReturnsPolicy = () => (
  <StaticPage title="Returns Policy">
    <p>We want you to be completely satisfied with your purchase.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">30-Day Returns</h2>
    <p>You may return most items within 30 days of delivery for a full refund.</p>
    <h2 className="font-display text-xl font-semibold text-foreground mt-6">Conditions</h2>
    <p>Items must be unused, in original packaging, and with all accessories included.</p>
  </StaticPage>
);

export const FAQ = () => (
  <StaticPage title="Frequently Asked Questions">
    {[
      ['How do I track my order?', 'Once your order ships, you\'ll receive a tracking number via email.'],
      ['What payment methods do you accept?', 'We accept all major credit cards and Stripe payments.'],
      ['Do you offer international shipping?', 'Currently, we ship within the United States. International shipping coming soon.'],
      ['What is your return policy?', 'We offer a 30-day return policy for all unused items in original packaging.'],
      ['Are all products authentic?', 'Yes, all products are sourced from authorized distributors and come with manufacturer warranty.'],
    ].map(([q, a]) => (
      <div key={q} className="mb-6">
        <h3 className="font-display font-semibold text-foreground">{q}</h3>
        <p>{a}</p>
      </div>
    ))}
  </StaticPage>
);
