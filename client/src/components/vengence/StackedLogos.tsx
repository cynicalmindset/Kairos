import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

/* =============================================================================
   StackedLogos Component (Vengeance UI)
   Multiple logo sets that animate in/out while stacked on top of each other.
   Uses CSS grid with separator lines for Vercel-style grid pattern.
   Both gradient AND border glow follow mouse position.
============================================================================= */

export interface StackedLogosProps {
  /** Array of logo groups - each group is an array of React nodes */
  logoGroups: React.ReactNode[][];
  /** Animation duration in seconds. Default: 20 */
  duration?: number;
  /** Stagger factor for animation timing between groups. Default: 0 */
  stagger?: number;
  /** Width of each logo container. Default: "160px" */
  logoWidth?: string;
  /** Additional CSS classes */
  className?: string;
}

export const StackedLogos = ({
  logoGroups,
  duration = 20,
  stagger = 0.5,
  logoWidth = "180px",
  className,
}: StackedLogosProps) => {
  const itemCount = logoGroups[0]?.length || 0;
  const columns = logoGroups.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Track mouse position for glow effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn("stacked-logos relative w-full overflow-hidden py-4", className)}
      style={
        {
          "--duration": duration,
          "--items": itemCount,
          "--lists": columns,
          "--stagger": stagger,
          "--logo-width": logoWidth,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
    >
      <style>{`
        .stacked-logos {
          --mouse-x: 0px;
          --mouse-y: 0px;
        }
        .stacked-logos:hover .stacked-logos__glow,
        .stacked-logos:hover .stacked-logos__border-glow {
          opacity: 1;
        }
        .stacked-logos__cell {
          --base-delay: calc(sin((var(--index) / var(--lists)) * 45deg) * var(--stagger));
        }
        .stacked-logos__logo {
          animation-name: stacked-logos-appear;
          animation-duration: calc(var(--duration) * 1s);
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          animation-delay: calc((var(--duration) / var(--items)) * (var(--items) - var(--i)) * -1s + (var(--base-delay, 0) * 1s));
        }
        @keyframes stacked-logos-appear {
          0%, 100% {
            opacity: 0;
            filter: blur(4px);
            transform: scale(0.96);
          }
          6%, 22% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
          28%, 100% {
            opacity: 0;
            filter: blur(4px);
            transform: scale(0.96);
          }
        }
      `}</style>

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="grid relative mx-auto w-fit max-w-full overflow-x-auto"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(130px, ${logoWidth}))`,
        }}
      >
        {/* Mouse-following glow overlay for background */}
        <div
          className="stacked-logos__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(16,185,129,0.08), transparent 70%)",
          }}
        />

        {/* Mouse-following glow for borders */}
        <div
          className="stacked-logos__border-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20"
          style={{
            background:
              "radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(16,185,129,0.35), transparent 50%)",
            maskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(${logoWidth} - 1px), black calc(${logoWidth} - 1px), black ${logoWidth}),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(${logoWidth} - 1px), black calc(${logoWidth} - 1px), black ${logoWidth}),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            maskComposite: "add",
            WebkitMaskComposite: "source-over",
          }}
        />

        {/* Logo Groups */}
        {logoGroups.map((logos, groupIndex) => (
          <div
            key={groupIndex}
            className="stacked-logos__cell relative grid min-h-[100px] md:min-h-[120px]"
            style={
              {
                "--index": groupIndex,
                gridTemplate: "1fr / 1fr",
              } as React.CSSProperties
            }
          >
            {/* Base border lines */}
            <div className="absolute top-0 bottom-0 right-0 w-px bg-zinc-200/80 dark:bg-zinc-800/80" />
            <div className="absolute left-0 right-0 bottom-0 h-px bg-zinc-200/80 dark:bg-zinc-800/80" />
            <div className="absolute left-0 right-0 top-0 h-px bg-zinc-200/80 dark:bg-zinc-800/80" />
            {groupIndex === 0 && (
              <div className="absolute top-0 bottom-0 left-0 w-px bg-zinc-200/80 dark:bg-zinc-800/80" />
            )}

            {/* Stacked logos */}
            {logos.map((logo, logoIndex) => (
              <div
                key={logoIndex}
                className="stacked-logos__item col-start-1 row-start-1 grid place-items-center py-8 px-4"
                style={{ "--i": logoIndex } as React.CSSProperties}
              >
                <div className="stacked-logos__logo w-full h-8 flex items-center justify-center transition-all duration-300">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedLogos;
