import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Shield, ExternalLink, Star } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsProfileHovered(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsProfileHovered(false);
    }, 180);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)] py-12 sm:py-16 px-4 sm:px-6 mt-16 sm:mt-20 transition-colors relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12">
        
        {/* Top Row: Brand & External Protocol Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-700/80 bg-black flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/assets/logo.png"
                alt="Kairos Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-mono font-bold text-sm tracking-wider uppercase text-[var(--text-primary)]">
              KAIROS
            </span>
            <span className="text-[10px] font-mono text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded">
              v1.0.0
            </span>
            <span className="text-xs text-[var(--text-secondary)] hidden md:inline">
              // Zero-Context-Switch Terminal Mesh
            </span>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <a
              href="https://github.com/cynicalmindset/Kairos"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <GithubIcon size={13} />
              <span>GitHub</span>
              <ExternalLink size={10} className="text-[var(--text-muted)]" />
            </a>
            <span className="text-[var(--border-strong)]">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-emerald-400" />
              <span>MIT License</span>
            </span>
          </div>
        </div>

        {/* Bottom Attribution & Apple-style Micro Profile Pill */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          
          {/* Left: Interactive 4cm Apple-grade Profile Trigger Pill */}
          <div
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-zinc-500 mr-2 hidden xs:inline">Engineered by</span>
            
            <button
              type="button"
              onClick={() => setIsProfileHovered(!isProfileHovered)}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700/90 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm group select-none"
              aria-label="View creator profile"
            >
              {/* Micro Avatar with Live Status Dot */}
              <div className="relative w-4.5 h-4.5 rounded-full overflow-hidden border border-zinc-700/80 bg-zinc-950 shrink-0">
                <img
                  src="/assets/pfp.png"
                  alt="Yash Raj"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-1 ring-zinc-950" />
              </div>
              
              <span className="text-[11px] font-sans font-medium tracking-tight text-zinc-200 group-hover:text-white">
                @cynicalmindset
              </span>
              
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 group-hover:bg-emerald-400 transition-colors" />
            </button>

            {/* Apple-Grade Floating Interactive Profile Card (Expands on Hover) */}
            <AnimatePresence>
              {isProfileHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full mb-2.5 left-0 z-50 w-76 sm:w-80 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-left pointer-events-auto"
                >
                  {/* Subtle top reflection gradient */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Header Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-900 shrink-0 shadow-md">
                      <img
                        src="/assets/pfp.png"
                        alt="Yash Raj"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white tracking-tight truncate font-sans">
                          Yash Raj
                        </span>
                        <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 truncate">@cynicalmindset</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-[11px] font-sans text-zinc-300/90 leading-relaxed mb-3">
                    Creator &amp; Core Architect of Kairos. Building terminal-native real-time collaboration engines and zero-bloat developer tools.
                  </p>

                  {/* Architecture Badges */}
                  <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                      Bun + Ink CLI
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                      &lt;18MB Heap
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      0.84ms p99
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                    <a
                      href="https://github.com/cynicalmindset"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-sans font-medium text-white transition-colors"
                    >
                      <GithubIcon size={12} />
                      <span>Profile</span>
                      <ArrowUpRight size={10} className="text-zinc-400" />
                    </a>
                    
                    <a
                      href="https://github.com/cynicalmindset/Kairos"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-sans font-semibold transition-colors shadow-sm"
                    >
                      <Star size={11} className="fill-zinc-950" />
                      <span>Star Repo</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Protocol Status & Back to Top */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] text-[var(--text-dim)]">IDE_FIRST // PROTOCOL</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
};
