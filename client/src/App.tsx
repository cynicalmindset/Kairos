import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTransition } from './components/MarqueeTransition';
import { EcosystemSection } from './components/EcosystemSection';
import { FeaturesBento } from './components/FeaturesBento';
import { RamComparisonSection } from './components/RamComparisonSection';
import { Roadmap } from './components/Roadmap';
import { Footer } from './components/Footer';

export function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('kairos-theme', 'dark');

    // Luxurious Lenis momentum smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors selection:bg-white selection:text-zinc-900 overflow-x-hidden whiteboard-dots">
      <Navbar />

      {/* 1. Full-Bleed Photographic Hero (Signal Research Reference) */}
      <Hero />

      {/* 2. Full-Bleed Continuous Protocol Marquee Transition */}
      <MarqueeTransition />

      {/* 3. Architectural Swiss Grid (Pure Dark Mode Technical Layout) */}
      <div className="flex-1 w-full max-w-6xl mx-auto border-x border-[var(--border)] flex flex-col">
        <main className="flex-1 w-full">
          <EcosystemSection />
          <FeaturesBento />
          <RamComparisonSection />
          <Roadmap />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
