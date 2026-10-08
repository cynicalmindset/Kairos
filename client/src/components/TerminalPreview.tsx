import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CornerDownLeft, Sparkles, Activity } from 'lucide-react';
import { ShareSheet } from './vengence/ShareSheet';

interface TerminalMessage {
  id: string;
  sender?: string;
  content: string;
  type: 'system' | 'chat' | 'command' | 'profile';
  time: string;
}

export const TerminalPreview: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: '1',
      content: 'kairos v1.0.0 daemon started on ws://localhost:3000',
      type: 'system',
      time: '14:30:01',
    },
    {
      id: '2',
      content: 'connected to wss://kairos-w84s.onrender.com/ws // channel: #core-team',
      type: 'system',
      time: '14:30:02',
    },
    {
      id: '3',
      sender: 'alex_lead',
      content: 'Auth cache deployed. Session verification dropped to 0.4ms.',
      type: 'chat',
      time: '14:30:14',
    },
    {
      id: '4',
      sender: 'sarah_infra',
      content: 'Transferred 14MB tarball directly to your workspace via /share.',
      type: 'chat',
      time: '14:30:29',
    },
  ]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const runCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const userEntry: TerminalMessage = {
      id: String(Date.now()),
      content: raw,
      type: 'command',
      time,
    };

    let response: TerminalMessage;

    if (raw === '/clear') {
      setMessages([]);
      setInputVal('');
      return;
    } else if (raw === '/profile') {
      response = {
        id: String(Date.now() + 1),
        content: `--- [USER PROFILE: cynicalmindset] ---
STATUS: ACTIVE [Flow Mode]
CHANNELS: #core-team, #infra, #pair-1
AUTH TTL: CACHED (< 1ms In-Memory Validation)`,
        type: 'profile',
        time,
      };
    } else if (raw === '/rooms') {
      response = {
        id: String(Date.now() + 1),
        content: `ACTIVE CHANNELS (3):
1. #core-team   [5 online] - Architecture review
2. #infra       [2 online] - Deployment logs
3. #pair-debug  [2 online] - Real-time terminal session`,
        type: 'system',
        time,
      };
    } else if (raw.startsWith('/share')) {
      response = {
        id: String(Date.now() + 1),
        content: `[FILE SHARE COMPLETED]
PAYLOAD: src/lib/auth-cache.ts (4.2 KB)
TRANSFER: Direct Peer Stream (0 cloud hops)
STATUS: Verified across all peers in #core-team (12ms)`,
        type: 'system',
        time,
      };
    } else if (raw === '/help') {
      response = {
        id: String(Date.now() + 1),
        content: `COMMANDS:
/profile       - Inspect developer stats
/rooms         - List active team channels
/share <path>  - Stream file directly to peers
/clear         - Reset terminal viewport`,
        type: 'system',
        time,
      };
    } else {
      response = {
        id: String(Date.now() + 1),
        sender: 'you',
        content: raw,
        type: 'chat',
        time,
      };
    }

    setMessages((prev) => [...prev, userEntry, response]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(inputVal);
    }
  };

  const quickPills = [
    { label: '/profile', desc: 'Inspect profile' },
    { label: '/rooms', desc: 'Active channels' },
    { label: '/share auth-cache.ts', desc: 'Stream file' },
    { label: '/help', desc: 'Command index' },
    { label: '/clear', desc: 'Clear log' },
  ];

  return (
    <section id="terminal" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--border)] overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-muted)] mb-3 shadow-sm">
          <Terminal size={12} className="text-emerald-500 shrink-0" />
          <span>LIVE TERMINAL SANDBOX</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Zero-latency interactive shell.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-md px-2">
          Experience Kairos real-time command line flow directly in your browser.
        </p>
      </div>

      {/* Terminal Window Box */}
      <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-2xl overflow-hidden font-mono">
        {/* Terminal Title Bar */}
        <div className="px-3.5 sm:px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 truncate mx-2">
            <span className="text-[var(--text-primary)] font-semibold">kairos</span>
            <span className="text-[var(--text-dim)]">//</span>
            <span className="text-[var(--text-secondary)]">#core-team</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 font-semibold tracking-wider shrink-0">
              <Activity size={12} className="animate-pulse" />
              <span>LIVE</span>
            </div>
            <ShareSheet
              buttonLabel="Share"
              title="Kairos Terminal Session"
            />
          </div>
        </div>

        {/* Message Log Viewport */}
        <div
          ref={logContainerRef}
          className="p-4 sm:p-5 h-64 sm:h-72 overflow-y-auto space-y-3 text-xs bg-[var(--bg-page)]/40 break-words"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="leading-relaxed"
              >
                {m.type === 'system' && (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 font-semibold">[sys]</span>
                    <pre className="font-mono whitespace-pre-wrap text-[var(--text-secondary)] text-[11px] sm:text-xs">{m.content}</pre>
                  </div>
                )}
                {m.type === 'command' && (
                  <div className="text-[var(--text-primary)] flex items-center gap-2 font-semibold">
                    <span className="text-emerald-500 shrink-0">$</span>
                    <span className="truncate">{m.content}</span>
                    <span className="text-[10px] text-[var(--text-dim)] ml-auto shrink-0">{m.time}</span>
                  </div>
                )}
                {m.type === 'profile' && (
                  <div className="p-3 sm:p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] overflow-x-auto">
                    <pre className="font-mono whitespace-pre-wrap leading-normal text-[10px] sm:text-[11px]">{m.content}</pre>
                  </div>
                )}
                {m.type === 'chat' && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-500 font-semibold shrink-0">{m.sender}:</span>
                    <span className="text-[var(--text-primary)]">{m.content}</span>
                    <span className="text-[10px] text-[var(--text-dim)] ml-auto shrink-0">{m.time}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Command Input Bar */}
        <div className="p-2.5 sm:p-3 bg-[var(--bg-subtle)] border-t border-[var(--border)] flex items-center gap-2 sm:gap-3">
          <span className="text-emerald-500 font-bold text-sm pl-1.5 sm:pl-2 shrink-0">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type /profile, /rooms, /share, /help..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] sm:text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] min-w-0"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runCommand(inputVal)}
            aria-label="Send command"
            className="p-1.5 rounded-md hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
          >
            <CornerDownLeft size={14} />
          </motion.button>
        </div>
      </div>

      {/* Quick Pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1 flex items-center gap-1 shrink-0">
          <Sparkles size={11} className="text-emerald-500" />
          Click to run:
        </span>
        {quickPills.map((pill) => (
          <motion.button
            key={pill.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => runCommand(pill.label)}
            className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
          >
            {pill.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default TerminalPreview;
