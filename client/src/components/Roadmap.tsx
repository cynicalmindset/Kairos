import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Roadmap() {
  const milestones = [
    {
      version: "v1.0",
      label: "Current Release",
      status: "Production Ready",
      state: "shipped" as const,
      isCurrent: true,
      completion: "100%",
      features: [
        "In-Memory Session & Auth Cache (< 1ms)",
        "Bi-directional WebSocket Multiplexer",
        "Direct P2P File Stream (/share)",
        "Zero-Chromium TTY/PTY Shell Engine",
      ],
    },
    {
      version: "v1.1",
      label: "Next Minor",
      status: "In Development",
      state: "in-progress" as const,
      isCurrent: false,
      completion: "Active Sprint",
      features: [
        "WebRTC Data Channel Direct Mesh",
        "Native ANSI Syntax Highlighting",
        "AES-256-GCM Private Enclaves",
        "Zero-Copy Memory Serialization",
      ],
    },
    {
      version: "v1.2",
      label: "Future Horizon",
      status: "Planned",
      state: "planned" as const,
      isCurrent: false,
      completion: "RFC Queue",
      features: [
        "VS Code & Cursor Daemon Sidecar",
        "Low-Latency Terminal Audio Pair",
        "Git Commit & PR Webhook Pipe",
        "Encrypted Ephemeral Logs",
      ],
    },
  ];

  return (
    <section id="roadmap" className="relative py-20 sm:py-28 px-4 sm:px-8 border-b border-zinc-800/80 overflow-hidden snap-start scroll-mt-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-zinc-800 bg-zinc-900/60 text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
          <span className="w-1.5 h-1.5 bg-white" />
          <span>ROADMAP &amp; HORIZONS</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Continuous evolution.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md">
          Transparent engineering milestones tracked in public on GitHub.
        </p>
      </motion.div>

      {/* 3 Milestone Cards - Apple-Grade Technical Layout */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
      >
        {milestones.map((m) => (
          <div
            key={m.version}
            className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
              m.isCurrent
                ? 'border-zinc-700 bg-zinc-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                : 'border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700/80'
            }`}
          >
            <div>
              {/* Header: Version, Label & Status Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-base font-bold text-white tracking-tight">
                      {m.version}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans">
                      {m.label}
                    </span>
                  </div>
                </div>

                {/* Minimalist Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-zinc-800 bg-zinc-900/80 text-zinc-300">
                  {m.state === 'shipped' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  )}
                  {m.state === 'in-progress' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                  )}
                  {m.state === 'planned' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  )}
                  <span>{m.status}</span>
                </div>
              </div>

              {/* Feature Items with Accurate State Indicators */}
              <ul className="space-y-3.5 mb-8">
                {m.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-xs leading-relaxed">
                    {/* Shipped: Crisp White Check */}
                    {m.state === 'shipped' && (
                      <div className="w-4 h-4 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                      </div>
                    )}

                    {/* In Progress: Subtle Pulsing Active Dot */}
                    {m.state === 'in-progress' && (
                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                      </div>
                    )}

                    {/* Planned: Subtle Minimal Ring */}
                    {m.state === 'planned' && (
                      <div className="w-4 h-4 rounded-full bg-transparent border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                      </div>
                    )}

                    <span
                      className={
                        m.state === 'shipped'
                          ? 'text-zinc-200 font-medium'
                          : m.state === 'in-progress'
                          ? 'text-zinc-300'
                          : 'text-zinc-400'
                      }
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Progress Marker */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Status</span>
              <span className={`text-[11px] font-semibold ${m.isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                {m.completion}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Clean GitHub CTA Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white">
            Open Source &amp; Fully Auditable
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            Read the protocol specs, inspect benchmarks, or track milestone branches directly on GitHub.
          </p>
        </div>
        <a
          href="https://github.com/cynicalmindset/Kairos"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-mono font-semibold hover:bg-zinc-200 transition-all shrink-0 shadow-sm hover:scale-102 active:scale-98"
        >
          <GithubIcon size={14} />
          <span>Track on GitHub</span>
          <ArrowUpRight size={13} />
        </a>
      </div>
    </section>
  );
}

export default Roadmap;
