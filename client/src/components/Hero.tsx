import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { LiquidMetalButton } from './vengence/LiquidMetal';

export function Hero() {
  const [copied, setCopied] = useState(false);
  const command = 'npm i -g kairos-command';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
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

        {/* 4. Action Buttons: Install (copies command) + Contribute (GitHub) */}
        <div className="relative flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-6">
          {/* Install: White with Liquid Glass Border & Black Text */}
          <div className="relative inline-flex flex-col items-center">
            <LiquidMetalButton
              onClick={handleCopy}
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
              className="select-none cursor-pointer"
            >
              <motion.span
                key={copied ? 'copied' : 'install'}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="text-zinc-950 font-semibold text-sm inline-flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Download size={14} className="text-zinc-950" />
                    <span>Install</span>
                  </>
                )}
              </motion.span>
            </LiquidMetalButton>

            {/* Boxy, White Notification Below Install */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -2, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-zinc-950 border border-zinc-200/90 shadow-[0_12px_28px_rgba(0,0,0,0.22)] font-mono text-xs whitespace-nowrap"
                >
                  <Check size={12} className="text-emerald-600 stroke-[2.5]" />
                  <span className="font-semibold text-zinc-900">Copied</span>
                  <span className="text-zinc-600 text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                    {command}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contribute: Frosted Glass Button linking to GitHub */}
          <a
            href="https://github.com/cynicalmindset/Kairos"
            target="_blank"
            rel="noreferrer"
            className="h-11 px-6 rounded-full inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white font-semibold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all hover:scale-102 active:scale-98 cursor-pointer select-none no-underline"
          >
            <GithubIcon size={14} />
            <span>Contribute</span>
            <ArrowUpRight size={13} className="opacity-70" />
          </a>
        </div>
      </div>

    </section>
  );
}

export default Hero;
