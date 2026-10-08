import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#how-it-works' },
    { label: 'Capabilities', href: '#architecture' },
    { label: 'RAM Audit', href: '#why-kairos' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] px-5 sm:px-6 h-12 sm:h-13 flex items-center justify-between pointer-events-auto transition-all">
        
        {/* Logo with user's provided logo.png */}
        <a href="#" className="flex items-center gap-2.5 no-underline text-white group shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/25 shadow-sm bg-black shrink-0">
            <img
              src="/assets/logo.png"
              alt="Kairos Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-sm tracking-tight text-white drop-shadow-sm font-sans">
            Kairos
          </span>
        </a>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-white/90 drop-shadow-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors py-1 hover:drop-shadow-md"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          <a
            href="https://github.com/cynicalmindset/Kairos"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-md"
          >
            <GithubIcon size={12} />
            <span>GitHub</span>
            <ArrowUpRight size={11} className="opacity-70" />
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            {mobileOpen ? <X size={13} /> : <Menu size={13} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Frosted Glass) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="md:hidden mt-2 max-w-sm mx-auto rounded-2xl border border-white/15 bg-black/85 backdrop-blur-2xl p-4 flex flex-col gap-2.5 text-xs font-medium text-zinc-100 shadow-2xl pointer-events-auto"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/cynicalmindset/Kairos"
              target="_blank"
              rel="noreferrer"
              className="pt-2.5 mt-1 border-t border-zinc-800 flex items-center gap-2 px-3 text-white font-semibold"
            >
              <GithubIcon size={13} />
              <span>cynicalmindset/Kairos</span>
              <ArrowUpRight size={11} className="ml-auto opacity-70" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
