import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Compass, Feather, Zap, Code } from 'lucide-react';

export const VisualShowcase: React.FC = () => {
  const visuals = [
    {
      title: 'The Modern Agora',
      tag: 'PHILOSOPHY // COLLABORATION',
      subtitle: 'Classical thinking meets terminal velocity. Collaborative focus without social distractions.',
      image: '/assets/hero-banner.jpg',
      icon: Compass,
      colSpan: 'lg:col-span-8',
      height: 'h-64 sm:h-80',
    },
    {
      title: 'Terminal Liberation',
      tag: '1-BIT ARCHITECTURE',
      subtitle: 'Escape the weight of gigabyte Chromium instances.',
      image: '/assets/dithering-dove.jpg',
      icon: Feather,
      colSpan: 'lg:col-span-4',
      height: 'h-64 sm:h-80',
    },
    {
      title: 'Instant Data Warp',
      tag: 'VELOCITY // WEBSOCKETS',
      subtitle: 'Binary payload streaming with sub-50ms peer latency.',
      image: '/assets/speed-warp.jpg',
      icon: Zap,
      colSpan: 'lg:col-span-4',
      height: 'h-64 sm:h-80',
    },
    {
      title: 'Matrix Aesthetics',
      tag: 'CODE // RAW PRECISION',
      subtitle: 'Pure keyboard-driven developer ergonomics in every keystroke.',
      image: '/assets/ascii-matrix.jpg',
      icon: Code,
      colSpan: 'lg:col-span-8',
      height: 'h-64 sm:h-80',
    },
  ];

  return (
    <section className="relative py-20 md:py-28 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-muted)] mb-3 shadow-sm">
          <Sparkles size={12} className="text-[var(--accent)]" />
          <span>CURATED_AESTHETICS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Crafted for the <span className="font-serif-italic font-normal">Thinkers</span>.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 max-w-lg">
          Minimalist 1-bit dithering, classical iconography, and modern developer engineering unified in harmony.
        </p>
      </div>

      {/* Bento Grid of Visual Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {visuals.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className={`${item.colSpan} frame-corner rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-all overflow-hidden flex flex-col justify-between shadow-md group`}
            >
              {/* Image Frame with controlled, responsive height */}
              <div className={`relative ${item.height} w-full overflow-hidden bg-[var(--bg-subtle)]`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Meta Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2 font-mono text-xs text-[var(--text-muted)]">
                  <span className="tracking-wider flex items-center gap-2">
                    <Icon size={13} className="text-[var(--accent)]" />
                    {item.tag}
                  </span>
                  <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
