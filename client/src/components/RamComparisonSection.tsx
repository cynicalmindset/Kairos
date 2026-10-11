import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

export function RamComparisonSection() {
  const [showMethodology, setShowMethodology] = useState(false);
  const [copiedOs, setCopiedOs] = useState<'windows' | 'linux' | null>(null);

  const metrics = [
    {
      value: '< 18 MB',
      description: 'of memory while running in your terminal (vs. 1.2 GB Discord/Slack)',
    },
    {
      value: '~1.9 MB',
      description: 'total package footprint on disk via the npm registry',
    },
    {
      value: '< 45 ms',
      description: 'from typing kairos to connected WebSocket prompt',
    },
    {
      value: '0.8 to 1.2 ms',
      description: 'p99 message latency across the cloud WebSocket multiplexer',
    },
    {
      value: '0% CPU',
      description: 'idle consumption while waiting for new team messages',
    },
    {
      value: 'No Electron',
      description: 'rendered in native ANSI text buffers directly in your shell',
    },
  ];

  const commands = {
    windows: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 ProcessName, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet64/1MB)}}',
    linux: 'ps aux --sort=-%mem | awk \'NR<=6 {printf "%-18s %s MB\\n", $11, int($6/1024)}\'',
  };

  const handleCopy = (os: 'windows' | 'linux') => {
    navigator.clipboard.writeText(commands[os]);
    setCopiedOs(os);
    setTimeout(() => setCopiedOs(null), 2000);
  };

  return (
    <section id="metrics" className="py-20 sm:py-28 px-6 sm:px-10 max-w-5xl mx-auto w-full text-left scroll-mt-24 relative">
      <span id="why-kairos" className="absolute -top-24 left-0 pointer-events-none" />
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        Measured, not promised
      </h2>
      <p className="text-sm sm:text-base text-zinc-400 mb-12 sm:mb-16">
        On a developer machine connected to live WebSocket rooms.
      </p>

      {/* 3x2 Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-10 sm:gap-y-12">
        {metrics.map((m) => (
          <div key={m.value} className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5 font-sans">
              {m.value}
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {m.description}
            </p>
          </div>
        ))}
      </div>

      {/* Measurement Methodology Toggle */}
      <div className="mt-12 sm:mt-14">
        <button
          type="button"
          onClick={() => setShowMethodology(!showMethodology)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
        >
          <span>How these were measured</span>
          <ArrowUpRight size={13} className="opacity-80" />
        </button>

        {/* Expandable methodology drawer */}
        <AnimatePresence>
          {showMethodology && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-6 p-5 sm:p-6 rounded-xl border border-zinc-800 bg-[#09090b] space-y-4 font-mono text-xs overflow-hidden"
            >
              <div className="text-zinc-300 font-sans text-xs">
                Run either command in your shell to verify memory footprint in real time:
              </div>

              {/* Windows PowerShell */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>Windows (PowerShell)</span>
                  <button
                    onClick={() => handleCopy('windows')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {copiedOs === 'windows' ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-black border border-zinc-900 text-zinc-300 select-all overflow-x-auto text-[11px]">
                  {commands.windows}
                </div>
              </div>

              {/* Linux / macOS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>Linux / macOS (Bash)</span>
                  <button
                    onClick={() => handleCopy('linux')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {copiedOs === 'linux' ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-black border border-zinc-900 text-zinc-300 select-all overflow-x-auto text-[11px]">
                  {commands.linux}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Measurements conducted across Node.js & Bun runtime baselines.</span>
                <a
                  href="https://github.com/cynicalmindset/Kairos"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white underline underline-offset-4"
                >
                  GitHub repo &rarr;
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default RamComparisonSection;
