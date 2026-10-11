import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, Package } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#how-it-works' },
    { label: 'Capabilities', href: '#architecture' },
    { label: 'Metrics', href: '#metrics' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#' || href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileOpen(false);
      return;
    }
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] px-5 sm:px-6 h-12 sm:h-13 flex items-center justify-between pointer-events-auto transition-all">
        
        {/* Logo with user's provided logo.png */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, '#')}
          className="flex items-center gap-2.5 no-underline text-white group shrink-0 cursor-pointer"
        >
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
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-white transition-colors py-1 hover:drop-shadow-md cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            href="https://www.npmjs.com/package/kairos-command"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm hover:scale-102"
            title="View package on npm"
          >
            <Package size={12} className="text-red-400" />
            <span>npm v1.0.4</span>
          </a>

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
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-1.5 px-3 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://www.npmjs.com/package/kairos-command"
              target="_blank"
              rel="noreferrer"
              className="pt-2.5 mt-1 border-t border-white/15 flex items-center gap-2 px-3 text-red-300 font-mono text-xs"
            >
              <Package size={13} className="text-red-400" />
              <span>npm: kairos-command v1.0.4</span>
              <ArrowUpRight size={11} className="ml-auto opacity-70" />
            </a>
            <a
              href="https://github.com/cynicalmindset/Kairos"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 text-white font-semibold"
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
