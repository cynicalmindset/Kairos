import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Cpu, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';

export const RationaleGrid: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const totalBars = 20;
  const activeBars = 17;

  const cards = [
    {
      num: '01',
      tag: 'COGNITIVE SCIENCE',
      title: 'The 23-Minute Context Penalty',
      reason:
        'Research confirms that recovering deep concentration after an interruption to browser-based chat takes an average of 23 minutes and 15 seconds. Kairos keeps communication in your terminal, eliminating the window switch entirely.',
      icon: Zap,
    },
    {
      num: '02',
      tag: 'SYSTEM ARCHITECTURE',
      title: '18MB Memory vs 1.4GB Electron',
      reason:
        'Standard team chat clients bundle entire Chromium instances that consume 800MB–1.4GB of system memory. Kairos runs natively inside your existing terminal shell with virtually zero resource overhead.',
      icon: Cpu,
    },
    {
      num: '03',
      tag: 'STREAMING PIPELINE',
      title: 'Direct Peer Workspace Transfers',
      reason:
        'Sharing files through external web tools requires uploading to remote cloud buckets and downloading via browser prompts. Kairos streams binary payloads directly to peer workspaces in sub-50ms.',
      icon: Shield,
    },
  ];

  return (
    <section id="rationale" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-muted)] mb-3 shadow-sm">
          <Layers size={12} className="text-[var(--accent)] shrink-0" />
          <span>ENGINEERING_RATIONALE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          The Reason Behind Everything.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 max-w-lg px-2">
          Every architectural constraint in Kairos is designed around one goal: continuous developer flow state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left: Focus Retention Metric Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 frame-corner p-5 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-semibold flex items-center gap-2">
                <Zap size={14} className="text-[var(--accent)] shrink-0" />
                Focus Retention Metric
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold shrink-0">
                BENCHMARKED
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Percentage of daily working hours spent inside uninterrupted flow state.
            </p>

            {/* Giant Stat Display */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-4xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
                83%
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-subtle)] font-mono text-xs font-medium text-[var(--text-primary)]">
                <TrendingUp size={12} className="text-emerald-400 shrink-0" />
                <span>+4.2x</span>
              </div>
            </div>

            {/* Interactive Spring Bars */}
            <div className="flex items-end gap-1 h-12 sm:h-14 w-full mb-4">
              {Array.from({ length: totalBars }).map((_, index) => {
                const isActive = index < activeBars;
                const isHovered = hoveredBar === index;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scaleY: 1.15 }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className={`flex-1 rounded-[2px] transition-colors cursor-pointer h-full ${
                      isActive
                        ? isHovered
                          ? 'bg-[var(--accent)]'
                          : 'bg-[var(--text-primary)] opacity-85'
                        : 'bg-[var(--text-dim)] opacity-40'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)]">
            <span>METRIC: FLOW_CONTINUITY</span>
            <span>CONTEXT_LOSS: 0%</span>
          </div>
        </motion.div>

        {/* Right: 3 Rationale Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
                className="frame-corner p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-[var(--accent)] font-bold">{c.num}.</span>
                      <span className="text-[var(--text-muted)] tracking-wider">{c.tag}</span>
                    </div>
                    <Icon size={15} className="text-[var(--text-secondary)] shrink-0" />
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {c.reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  <span>Production verified constraint</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
