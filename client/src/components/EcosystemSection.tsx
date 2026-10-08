import { motion } from 'framer-motion';
import { StackedLogos } from "./vengence/StackedLogos";
import { Terminal, Zap, Cpu, Radio, Shield, Box, Code } from "lucide-react";

export function EcosystemSection() {
  const columns = [
    {
      tag: "TERMINAL CHANNELS",
      image: "/assets/2.png",
      title: "Real-time rooms inside your shell",
      description: "Chat with teammates across dedicated rooms without switching windows or breaking flow state. Sub-1ms WebSockets keep you in sync.",
      cmd: "/rooms · /join #core-team",
    },
    {
      tag: "P2P FILE STREAMING",
      image: "/assets/8.png",
      title: "Direct workspace file transfers",
      description: "Stream code files, configs, and diffs straight into teammate directories via /share. Teammates accept with one key. Zero cloud uploads.",
      cmd: "/share ./src/api.ts · /accept",
    },
    {
      tag: "ZERO-ELECTRON ARCHITECTURE",
      image: "/assets/7.png",
      title: "Developer presence at < 18MB RAM",
      description: "See who is active and which branch they are hacking on with zero Chromium overhead. Starts in 40ms, keeps your laptop fans silent.",
      cmd: "/profile · /members",
    },
  ];

  const logoGroups = [
    [
      <div key="term" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
        <span>iTerm2</span>
      </div>,
      <div key="ala" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
        <span>Alacritty</span>
      </div>,
      <div key="ghost" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
        <span>Ghostty</span>
      </div>,
    ],
    [
      <div key="bun" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Zap className="w-3.5 h-3.5 text-zinc-500" />
        <span>Bun.sh</span>
      </div>,
      <div key="ink" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Cpu className="w-3.5 h-3.5 text-zinc-500" />
        <span>Ink CLI</span>
      </div>,
      <div key="node" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Code className="w-3.5 h-3.5 text-zinc-500" />
        <span>Node.js</span>
      </div>,
    ],
    [
      <div key="ws" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Radio className="w-3.5 h-3.5 text-zinc-500" />
        <span>WebSockets</span>
      </div>,
      <div key="rtc" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Radio className="w-3.5 h-3.5 text-zinc-500" />
        <span>P2P Stream</span>
      </div>,
      <div key="sec" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Shield className="w-3.5 h-3.5 text-zinc-500" />
        <span>In-Memory Auth</span>
      </div>,
    ],
    [
      <div key="vscode" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Box className="w-3.5 h-3.5 text-zinc-500" />
        <span>VS Code</span>
      </div>,
      <div key="cursor" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Box className="w-3.5 h-3.5 text-zinc-500" />
        <span>Cursor IDE</span>
      </div>,
      <div key="tmux" className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
        <span>Tmux</span>
      </div>,
    ],
  ];

  return (
    <section id="how-it-works" className="w-full border-t border-[var(--border)] pt-16 sm:pt-20 pb-16 px-4 sm:px-6 snap-start scroll-mt-20">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border)] bg-[var(--bg-subtle)] text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-3">
          <span className="w-1.5 h-1.5 bg-[var(--text-primary)]" />
          <span>BENEFITS &amp; CAPABILITIES</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Join modern teams collaborating in their terminal
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
          The essential communication protocol for developers who refuse to break flow state.
        </p>
      </motion.div>

      {/* 3-Column Architectural Grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border)] divide-y md:divide-y-0 md:divide-x divide-[var(--border)] rounded-md bg-[var(--bg-page)] overflow-hidden shadow-sm mb-16"
      >
        {columns.map((col, idx) => (
          <div key={col.tag} className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category tag box */}
              <div className="inline-block px-2 py-0.5 rounded-sm border border-[var(--border)] bg-[var(--bg-subtle)] text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-6">
                {col.tag}
              </div>

              {/* Clean artifact visual frame */}
              <div className="w-full h-40 sm:h-48 rounded border border-[var(--border)] bg-[var(--bg-subtle)] overflow-hidden flex items-center justify-center mb-6">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Bold headline */}
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)] mb-2.5 leading-snug">
                {col.title}
              </h3>

              {/* Clean concise explanation */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                {col.description}
              </p>
            </div>

            {/* Bottom command indicator */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>{col.cmd}</span>
              <span className="font-semibold text-[var(--text-primary)]">0{idx + 1}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stacked Logos Integration (Clean 1px Border Container) */}
      <div className="pt-8 border-t border-[var(--border)] text-center">
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-1">
            STACKED ECOSYSTEM
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            Seamless interoperability with your existing terminal setup
          </h4>
        </div>

        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-4 overflow-hidden">
          <StackedLogos
            logoGroups={logoGroups}
            duration={24}
            stagger={0.4}
            logoWidth="180px"
          />
        </div>
      </div>

    </section>
  );
}

export default EcosystemSection;
