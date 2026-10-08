import { useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { LiquidMetalButton } from './vengence/LiquidMetal';

export function Hero() {
  const [copied, setCopied] = useState(false);
  const command = 'bun run CLI/src/index.tsx';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-10 sm:pt-28 sm:pb-20 overflow-hidden snap-start scroll-mt-0">
      
      {/* 1. Full-Bleed Sky Canopy Photographic Canvas (User's provided image) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/sky-canopy.png"
          alt="Lush green canopy framing clear blue sky"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Ambient darkening overlays for crystal clear white typography & glass contrast */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
        <div className="absolute inset-0 whiteboard-dots opacity-25 pointer-events-none" />
      </div>

      {/* 2. Scaled Down (~15% smaller) Headline (Instrument Serif) */}
      <div className="relative max-w-3xl mx-auto z-10 flex flex-col items-center">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-white leading-[1.06] drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)] mb-5 select-none"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Your terminal has
          <br />
          enough RAM to <span className="italic">talk.</span>
        </h1>

        {/* 3. Scaled Down Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] mb-8 font-normal">
          Real-time team chat, channels, and direct workspace file transfers built entirely into your terminal. Zero Electron bloat.
        </p>

        {/* 4. Action Buttons: Explore CLI (White with Liquid Glass & Black text) + Watch demo (Normal Glass), both same size */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-6">
          {/* Explore CLI: White with Liquid Glass Border & Black Text */}
          <LiquidMetalButton
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="white"
            size="md"
            borderWidth={2}
            metalConfig={{
              colorBack: "#94a3b8",
              colorTint: "#ffffff",
              speed: 0.55,
              repetition: 3,
              distortion: 0.15,
            }}
            className="select-none"
          >
            <span className="text-zinc-950 font-semibold text-sm inline-flex items-center gap-1.5">
              Explore CLI <ArrowRight size={14} className="text-zinc-950" />
            </span>
          </LiquidMetalButton>

          {/* Watch demo: Normal Frosted Glass Button (Exact Same Size h-11 px-6) */}
          <button
            type="button"
            onClick={handleCopy}
            className="h-11 px-6 rounded-full inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white font-semibold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all hover:scale-102 active:scale-98 cursor-pointer select-none"
          >
            <Play size={12} className="fill-white ml-0.5" />
            <span>{copied ? 'Copied command!' : 'Watch demo'}</span>
          </button>
        </div>
      </div>

    </section>
  );
}

export default Hero;
