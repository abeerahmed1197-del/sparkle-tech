import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MorphingText from '@/components/magicui/MorphingText';
import Meteors from '@/components/magicui/Meteors';
import { useHeroSettings } from '@/hooks/useSiteSettings';

const HeroSection = () => {
  const { data: hero } = useHeroSettings();
  if (!hero) return <section className="min-h-[90vh]" />;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />
      <Meteors number={15} />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" /> The Future of Tech Shopping
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {hero.headline}{' '}
            <MorphingText texts={hero.morph_words} className="text-gradient" />
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-lg" asChild>
              <Link to={hero.primary_cta_href}>{hero.primary_cta_label} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full" asChild>
              <Link to={hero.secondary_cta_href}>{hero.secondary_cta_label}</Link>
            </Button>
          </motion.div>

          <motion.div
            className="relative mt-16 mx-auto max-w-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="absolute -inset-8 bg-hero-gradient rounded-[32px] opacity-10 blur-3xl" />
            <div className="relative rounded-[24px] overflow-hidden border border-border/30 shadow-elevation-3">
              <img src={hero.image_url} alt="Premium Electronics Collection" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <motion.div
              className="absolute -left-8 top-1/4 glass rounded-2xl p-4 shadow-elevation-3 hidden md:block"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm">500+ Products</p>
                  <p className="text-xs text-muted-foreground">Premium Selection</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-6 bottom-1/3 glass rounded-2xl p-4 shadow-elevation-3 hidden md:block"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-sm">45+</div>
                <div>
                  <p className="font-display font-bold text-sm">Top Brands</p>
                  <p className="text-xs text-muted-foreground">Worldwide</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
