import React from 'react';

export const MarqueeTransition: React.FC = () => {
  const items = [
    "BUN RUN CLI",
    "SUB-1MS WEBSOCKET PIPELINE",
    "DIRECT P2P STREAM",
    "/ROOMS #CORE-TEAM",
    "18MB NATIVE HEAP",
    "/SHARE WORKSPACE FILE",
    "ZERO ELECTRON BLOAT",
    "IN-MEMORY AUTH CACHE",
    "/ACCEPT INSTANT PATCH",
    "DEVELOPER PRESENCE",
    "NON-CUSTODIAL CREDENTIALS",
    "DUPLEX WEBSOCKET TCP",
  ];

  // Repeat twice for seamless infinite loop
  const repeated = [...items, ...items];

  return (
    <div className="relative w-full border-y border-[var(--border)] bg-[var(--bg-subtle)] py-3 overflow-hidden select-none">
      {/* Edge gradient fade masks */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--bg-page)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--bg-page)] to-transparent z-10 pointer-events-none" />

      {/* Infinite Hardware-Accelerated Marquee Track */}
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {repeated.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>{item}</span>
            <span className="text-[var(--text-dim)] font-bold">//</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTransition;
