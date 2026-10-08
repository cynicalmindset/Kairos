import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Cpu } from 'lucide-react';

export function RamComparisonSection() {
  const [activeOs, setActiveOs] = useState<'windows' | 'linux'>('windows');
  const [copied, setCopied] = useState(false);

  const commands = {
    windows: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 ProcessName, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet64/1MB)}}',
    linux: 'ps aux --sort=-%mem | awk \'NR<=6 {printf "%-18s %s MB\\n", $11, int($6/1024)}\'',
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(commands[activeOs]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apps = [
    {
      name: 'Google Chrome',
      role: '10+ Browser Tabs',
      ram: '1,450 MB',
      percentage: 92,
      tag: 'CHROMIUM ENGINE',
      icon: (
        <svg className="w-4.5 h-4.5 stroke-zinc-400" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="21.17" y1="8" x2="12" y2="8" />
          <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
          <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
        </svg>
      ),
    },
    {
      name: 'Discord Desktop',
      role: 'Voice & Channel Feed',
      ram: '920 MB',
      percentage: 65,
      tag: 'ELECTRON RUNTIME',
      icon: (
        <svg className="w-4.5 h-4.5 fill-zinc-400" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp Desktop',
      role: 'Background Webview Tray',
      ram: '640 MB',
      percentage: 45,
      tag: 'WEBVIEW INSTANCE',
      icon: (
        <svg className="w-4.5 h-4.5 fill-zinc-400" viewBox="0 0 24 24">
          <path d="M12.031 2C6.516 2 2.016 6.5 2.016 12.016c0 1.834.492 3.565 1.367 5.076L2 22l5.056-1.328c1.464.8 3.14 1.254 4.975 1.254 5.516 0 10.016-4.5 10.016-10.016S17.547 2 12.031 2zm5.836 14.195c-.242.684-1.219 1.277-1.781 1.344-.539.066-1.223.1-3.563-.867-2.82-1.164-4.633-4.039-4.773-4.227-.14-.188-1.125-1.5-1.125-2.859 0-1.359.711-2.023.965-2.297.254-.273.555-.344.742-.344.188 0 .375.004.539.012.172.008.406-.066.633.484.234.563.805 1.961.875 2.102.07.14.117.305.023.492-.094.188-.14.305-.281.469-.14.164-.297.367-.422.492-.14.14-.289.297-.125.578.164.281.727 1.199 1.563 1.945 1.074.961 1.98 1.258 2.262 1.398.281.14.445.117.609-.07.164-.188.703-.82 1.031-1.102.328-.281.445-.234.68-.14.234.094 1.484.703 1.742.836.258.133.43.195.492.305.062.109.062.633-.18 1.317z" />
        </svg>
      ),
    },
    {
      name: 'Kairos Shell',
      role: 'Direct In-Terminal P2P Stream',
      ram: '18 MB',
      percentage: 3,
      tag: 'NATIVE ANSI PTY',
      isHero: true,
      icon: (
        <div className="w-4.5 h-4.5 rounded-full overflow-hidden border border-white/40 bg-black shrink-0">
          <img src="/assets/logo.png" alt="Kairos" className="w-full h-full object-cover" />
        </div>
      ),
    },
  ];

  return (
    <section id="why-kairos" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full border-t border-zinc-800/80 snap-start scroll-mt-20">
      
      {/* Clean Minimal Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-12 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100 max-w-2xl leading-tight">
          Where does your laptop&apos;s memory actually go?
        </h2>
        
        <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-xl leading-relaxed">
          Desktop chat apps run separate Chromium instances under the hood. 
          Kairos executes directly in your shell at a fraction of the cost.
        </p>
      </motion.div>

      {/* Main Grid: Clean Monochrome RAM Bars vs Terminal Process Inspector */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        
        {/* Left 7 Columns: Minimalist Monochrome RAM Consumption */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-zinc-800/80">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Memory Footprint Comparison
              </span>
              <span className="font-mono text-[11px] text-zinc-500">Idle / Baseline</span>
            </div>

            <div className="flex flex-col gap-5">
              {apps.map((app) => (
                <div key={app.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {app.icon}
                      <div>
                        <span className={`font-medium ${app.isHero ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                          {app.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 ml-2 hidden sm:inline">
                          {app.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${app.isHero ? 'text-white font-semibold' : 'text-zinc-300'}`}>
                        {app.ram}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/60">
                        {app.tag}
                      </span>
                    </div>
                  </div>

                  {/* Clean Monochrome Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        app.isHero ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-zinc-700'
                      }`}
                      style={{ width: `${app.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Understated Note */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
            <Cpu size={14} className="text-zinc-500 shrink-0" />
            <p className="leading-relaxed">
              Kairos utilizes native terminal ANSI buffers. No Chromium webviews, no idle background listeners.
            </p>
          </div>
        </div>

        {/* Right 5 Columns: Clean Interactive Terminal Process Inspector */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header with OS Switcher */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800/80">
              <span className="font-mono text-xs text-zinc-300 font-medium">
                Verify In Your Terminal
              </span>

              {/* OS Tabs */}
              <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveOs('windows')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    activeOs === 'windows' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Windows
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOs('linux')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    activeOs === 'linux' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Linux / macOS
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Run this one-liner in your terminal to view the top memory-consuming processes currently active on your machine:
            </p>

            {/* Monochromatic Code Block */}
            <div className="rounded-xl bg-black border border-zinc-800 p-3.5 mb-4 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              <div className="text-zinc-500 mb-1 select-none">
                # {activeOs === 'windows' ? 'PowerShell WorkingSet' : 'Top Memory Processes'}
              </div>
              <div className="text-zinc-200 select-all whitespace-pre-wrap break-all leading-relaxed">
                {commands[activeOs]}
              </div>

              <button
                type="button"
                onClick={handleCopyCommand}
                aria-label="Copy memory command"
                className="mt-3.5 w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-sans text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-zinc-200" />
                    <span className="text-[11px] font-medium text-white">Copied command</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} className="text-zinc-400" />
                    <span className="text-[11px]">Copy Command</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Understated Shortcut Footnote */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Shortcut: Task Manager</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
              Ctrl+Shift+Esc
            </kbd>
          </div>
        </div>

      </motion.div>

    </section>
  );
}

export default RamComparisonSection;
