import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

export function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-32 pb-20 container mx-auto px-8 max-w-3xl">
        <h1 className="font-['Cormorant'] text-5xl font-light text-[#4A3F3F] mb-6">{title}</h1>
        <div className="font-['Inter'] text-[#8B7373] leading-relaxed space-y-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function AboutPage() {
  return (
    <SimplePage title="About deedaa">
      <p>
        deedaa was born from a simple belief: beauty should be effortless, elegant, and empowering. We create
        luxurious formulas that enhance your natural beauty without compromise.
      </p>
      <p>
        Every product is thoughtfully crafted with clean, nourishing ingredients that care for your skin while
        delivering beautiful, long-lasting results.
      </p>
    </SimplePage>
  );
}

export function IngredientsPage() {
  return (
    <SimplePage title="Ingredients">
      <p>Our formulas favor nourishing oils, botanicals, and skin-kind actives. We avoid unnecessary fillers.</p>
      <p>Each product page lists the story of the formula. Full INCI lists can be added as you finalize manufacturing.</p>
    </SimplePage>
  );
}

export function JournalPage() {
  return (
    <SimplePage title="Journal">
      <p>Soft on lips. Strong on confidence. Notes on ritual, texture, and modern femininity will live here.</p>
    </SimplePage>
  );
}

export function ContactPage() {
  return (
    <SimplePage title="Contact">
      <p>Email  [email protected] with order questions. This is a working demo storefront — no live support desk yet.</p>
    </SimplePage>
  );
}

export function ShippingPage() {
  return (
    <SimplePage title="Shipping & Returns">
      <p>Orders over $50 ship free in this demo. Returns are not processed automatically.</p>
    </SimplePage>
  );
}

export function PrivacyPage() {
  return (
    <SimplePage title="Privacy Policy">
      <p>
        We store your name, email, hashed password, cart, orders, and optional newsletter email. Authentication uses an
        HTTP-only cookie. Do not use real payment cards — checkout does not charge a processor.
      </p>
    </SimplePage>
  );
}

export function TermsPage() {
  return (
    <SimplePage title="Terms of Service">
      <p>This storefront is a demonstration. Product availability, prices, and fulfillment are not a commercial offer unless you operate it as one.</p>
    </SimplePage>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto max-w-3xl px-8 pt-40 pb-24 text-center">
        <p className="font-['Inter'] text-sm uppercase tracking-[0.3em] text-[#D4A5A5] mb-4">404</p>
        <h1 className="font-['Cormorant'] text-5xl font-light text-[#4A3F3F] mb-4">This page wandered off</h1>
        <p className="font-['Inter'] text-[#8B7373] mb-8">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-block rounded-full bg-[#E5B4B4] px-8 py-3 font-['Inter'] text-sm text-white hover:bg-[#D4A5A5]"
        >
          Back to deedaa
        </Link>
      </main>
      <Footer />
    </div>
  );
}
