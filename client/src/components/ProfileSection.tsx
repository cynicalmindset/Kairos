import { useState } from 'react';
import { Copy, Check, Terminal, ArrowUpRight, Code, Zap, Radio, Shield, GitBranch } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function ProfileSection() {
  const [copied, setCopied] = useState(false);
  const command = 'bun run CLI/src/index.tsx';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const profileStats = [
    { label: "Status", value: "ONLINE [Flow Mode]", icon: Radio, accent: "text-emerald-400" },
    { label: "Role", value: "Creator & Core Architect", icon: Code, accent: "text-zinc-200" },
    { label: "Repository", value: "cynicalmindset/Kairos", icon: GitBranch, accent: "text-indigo-400" },
    { label: "Runtime", value: "Bun + Ink CLI (<18MB RAM)", icon: Zap, accent: "text-amber-400" },
    { label: "Latency", value: "0.84ms Duplex Socket p99", icon: Terminal, accent: "text-emerald-400" },
    { label: "License", value: "MIT Open Source", icon: Shield, accent: "text-zinc-300" },
  ];

  return (
    <section id="profile" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full border-t border-zinc-200/80 dark:border-zinc-800/80">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Engineered by @cynicalmindset
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
          Building terminal-native collaboration tools, low-latency communication networks, and bloat-free developer software.
        </p>
      </div>

      {/* Main Profile Card Container */}
      <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-md p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Avatar Column */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative group">
              {/* Outer ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 via-indigo-500/20 to-amber-500/20 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              
              {/* PFP Image Frame */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/80 bg-zinc-950 shadow-2xl">
                <img
                  src="/assets/pfp.png"
                  alt="cynicalmindset avatar"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-200 uppercase tracking-wider font-semibold">
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                cynicalmindset
              </h3>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Yash Raj &bull; System Architect
              </p>
            </div>

            {/* Social / GitHub Link Buttons */}
            <div className="mt-5 flex items-center gap-2.5 flex-wrap justify-center">
              <a
                href="https://github.com/cynicalmindset"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors shadow-sm"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
                <ArrowUpRight size={12} className="opacity-60" />
              </a>

              <a
                href="https://github.com/cynicalmindset/Kairos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>Star Repo</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Details / Stats Column */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Terminal Profile Card // $ /profile
                </span>
                <span className="font-mono text-[11px] text-emerald-500 font-semibold">
                  AUTH_CACHED [0.4ms]
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                Frustrated by heavy Electron chat clients devouring 2GB of RAM and pulling developers out of their flow state, I created <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Kairos</strong>: a full-featured real-time team collaboration shell and peer-to-peer workspace file streamer that lives 100% inside your IDE terminal pane.
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {profileStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                          {stat.label}
                        </span>
                      </div>
                      <span className={`font-mono text-xs font-semibold ${stat.accent}`}>
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Command Snippet (Sharp Box, No Pills) */}
            <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Launch CLI directly from terminal:
              </div>

              <div
                onClick={handleCopy}
                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>{command}</span>
                {copied ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold ml-1">
                    <Check className="w-3 h-3" />
                    <span>Copied</span>
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 ml-1" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
