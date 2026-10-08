import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, FileCode, UserCheck, Copy, Check, Hash, ArrowRightLeft } from 'lucide-react';

export const TechnicalSpecs: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const commands = [
    {
      cmd: '/profile',
      action: 'Player Card',
      desc: 'Queries developer activity metrics, active rooms, and total binary files shared.',
    },
    {
      cmd: '/share <path>',
      action: 'File Stream',
      desc: 'Streams binary payloads directly to peer workspace without cloud intermediaries.',
    },
    {
      cmd: '/rooms',
      action: 'Channel Mesh',
      desc: 'Lists active team channels, live member presence counters, and unread buffers.',
    },
    {
      cmd: '/home (or Esc)',
      action: 'Fast Nav',
      desc: 'Returns to dashboard while maintaining active background socket connection.',
    },
    {
      cmd: '/clear',
      action: 'Buffer Flush',
      desc: 'Resets terminal scrollback viewport while keeping room subscription intact.',
    },
  ];

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd.split(' ')[0]);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <section id="specs" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-muted)] mb-3 shadow-sm">
          <Terminal size={12} className="text-[var(--accent)] shrink-0" />
          <span>SPECIFICATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Command Line Protocol.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 max-w-lg px-2">
          Zero mouse dependence. Fast, deterministic keyboard navigation designed for developers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Command Reference Table (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 frame-corner p-5 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border)] font-mono text-xs">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <FileCode size={15} className="text-[var(--accent)] shrink-0" />
                DIRECTIVE REFERENCE
              </span>
              <span className="text-[var(--text-muted)] text-[11px]">5 DIRECTIVES</span>
            </div>

            <div className="space-y-3">
              {commands.map((c) => (
                <div
                  key={c.cmd}
                  onClick={() => handleCopy(c.cmd)}
                  className="p-3 sm:p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card-hover)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <code className="font-mono font-bold text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded border border-[var(--border)] text-[11px] shrink-0">
                      {c.cmd}
                    </code>
                    <span className="font-mono text-[var(--text-primary)] font-semibold text-xs">
                      {c.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:text-right">
                    <p className="text-[11px] text-[var(--text-secondary)] max-w-xs leading-normal">
                      {c.desc}
                    </p>
                    <button
                      type="button"
                      aria-label={`Copy command ${c.cmd}`}
                      className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors p-1 shrink-0"
                    >
                      {copiedCmd === c.cmd ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)]">
            <span>INPUT_MODE: RAW_TTY</span>
            <span>SHORTCUTS: ESC / TAB / CTRL+C</span>
          </div>
        </motion.div>

        {/* Right: Live Profile Player Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 frame-corner p-5 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border)] font-mono text-xs">
              <div className="flex items-center gap-2">
                <UserCheck size={15} className="text-[var(--accent)] shrink-0" />
                <span className="font-bold text-[var(--text-primary)]">/profile Live Output</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                ACTIVE_NODE
              </span>
            </div>

            {/* User Bio Card */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-strong)] flex items-center justify-center font-mono font-bold text-sm text-[var(--accent)] shrink-0">
                CM
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>cynicalmindset</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal border border-[var(--border)] px-1.5 rounded">LEAD</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Core Maintainer &bull; Member since 2026
                </div>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="space-y-2.5 font-mono text-xs text-[var(--text-secondary)]">
              <div className="p-2.5 sm:p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Hash size={13} className="text-[var(--text-muted)] shrink-0" />
                  CHANNELS:
                </span>
                <span className="text-[var(--text-primary)] font-semibold">6 channels</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Terminal size={13} className="text-[var(--text-muted)] shrink-0" />
                  MESSAGES:
                </span>
                <span className="text-[var(--text-primary)] font-semibold">3,281</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <ArrowRightLeft size={13} className="text-[var(--text-muted)] shrink-0" />
                  STREAMS:
                </span>
                <span className="text-[var(--text-primary)] font-semibold">142 files</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  LATENCY:
                </span>
                <span className="text-emerald-400 font-semibold">&lt; 1ms (Cached)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)]">
            <span>SOCKET_ID: node_984f</span>
            <span>PING: 14ms</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
