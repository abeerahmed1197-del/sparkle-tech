import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import BentoDiscovery from '@/components/home/BentoDiscovery';
import SmartphoneShowcase from '@/components/home/SmartphoneShowcase';
import FeaturedDevices from '@/components/home/FeaturedDevices';
import AccessoriesSection from '@/components/home/AccessoriesSection';
import DealOfTheWeek from '@/components/home/DealOfTheWeek';
import TechExperience from '@/components/home/TechExperience';
import BrandShowcase from '@/components/home/BrandShowcase';
import Newsletter from '@/components/home/Newsletter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BentoDiscovery />
      <SmartphoneShowcase />
      <FeaturedDevices />
      <DealOfTheWeek />
      <AccessoriesSection />
      <TechExperience />
      <BrandShowcase />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
