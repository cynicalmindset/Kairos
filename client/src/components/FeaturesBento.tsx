import { motion } from 'framer-motion';
import { ShareSheet } from "./vengence/ShareSheet";
import { Zap, Terminal, Share2 } from "lucide-react";

export function FeaturesBento() {
  const specs = [
    {
      id: "01",
      tag: "LATENCY LOOP",
      title: "Sub-1ms Duplex WebSocket Pipeline",
      metric: "0.84ms p99",
      desc: "Keystrokes, team messages, and member presence multiplexed over raw binary TCP frames. Zero polling, zero HTTP overhead, zero delay.",
      icon: Zap,
      accent: "text-amber-500",
    },
    {
      id: "02",
      tag: "MEMORY HEAP",
      title: "Featherweight 18MB Native TTY Shell",
      metric: "18MB Heap",
      desc: "Built on Ink and Bun. Replaces bloated 1.5GB Electron webviews with native ANSI terminal output. Zero idle CPU cycles, your fans stay silent.",
      icon: Terminal,
      accent: "text-emerald-500",
    },
    {
      id: "03",
      tag: "P2P TRANSFER",
      title: "Direct Workspace File Beaming (/share)",
      metric: "Zero Cloud Hops",
      desc: "Stream code files, diffs, and tarballs directly into a peer's local folder. Teammates accept with one key. No cloud drive uploads or size limits.",
      icon: Share2,
      accent: "text-indigo-500",
    },
  ];

  return (
    <section id="architecture" className="relative py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-zinc-800/80 snap-start scroll-mt-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-12 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
          Engineered for raw speed. Not Electron.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          How Kairos eliminates 2GB of webview memory waste and routes team chat and file sharing directly through terminal I/O.
        </p>
      </motion.div>

      {/* Asymmetric Technical Architecture Grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        
        {/* Left Column: 3 Technical Specifications Blocks (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
          {specs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 transition-colors hover:border-zinc-400 dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.accent}`} />
                  </div>
                  <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {item.metric}
                  </span>
                </div>

                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full-Bleed Image Showcase using 6.png with Floating Frosted Glass Share Button */}
        <div className="lg:col-span-5 relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 overflow-hidden bg-black min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-5 sm:p-6 group shadow-sm">
          <img
            src="/assets/6.png"
            alt="Terminal Matrix Art"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle gradient vignette at bottom so frosted glass share button pops */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* Floating Frosted Glass Share Button */}
          <div className="relative z-10 flex items-center justify-start">
            <ShareSheet
              buttonLabel="Share Stream ↗"
              title="Kairos Direct Stream"
              iconClassName="text-white"
              triggerClassName="bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-xl border border-white/40 dark:border-white/40 text-white dark:text-white font-medium text-xs shadow-lg transition-all hover:scale-102 cursor-pointer px-4 py-2.5"
            />
          </div>
        </div>

      </motion.div>
    </section>
  );
}

export default FeaturesBento;
