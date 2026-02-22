import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { PreOrderBanner } from './components/PreOrderBanner';
import { BrandStory } from './components/BrandStory';
import { BestSellers } from './components/BestSellers';
import { Testimonials } from './components/Testimonials';
import { EmailSignup } from './components/EmailSignup';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <main className="pt-20">
        <Hero />
        <FeaturedProducts />
        <PreOrderBanner />
        <BrandStory />
        <BestSellers />
        <Testimonials />
        <EmailSignup />
      </main>
      <Footer />
    </div>
  );
}
