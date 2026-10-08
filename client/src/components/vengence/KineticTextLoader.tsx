import React from "react";
import { cn } from "@/lib/utils";

export interface KineticTextLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function KineticTextLoader({ 
  className, 
  text = "Kairos", 
  size = "md",
  ...props 
}: KineticTextLoaderProps) {
  const letters = text.split("");

  const sizeClasses = {
    sm: "text-2xl md:text-3xl tracking-[4px]",
    md: "text-4xl md:text-5xl tracking-[6px]",
    lg: "text-5xl md:text-6xl lg:text-7xl tracking-[8px]",
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center font-light select-none py-2", className)} 
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      {...props}
    >
      <style>{`
        @keyframes ktl-dotMove {
          0%, 100% { transform: rotate(180deg) translate(-75px, -8px) rotate(-180deg); }
          50% { transform: rotate(0deg) translate(-75px, 8px) rotate(0deg); }
        }
        @keyframes ktl-letterStretch {
          0%, 100% { transform: scale(1, 0.45); transform-origin: 100% 75%; }
          8%, 28% { transform: scale(1, 1.35); transform-origin: 100% 67%; }
          37% { transform: scale(1, 0.9); transform-origin: 100% 75%; }
          46% { transform: scale(1, 1.05); transform-origin: 100% 75%; }
          50%, 97% { transform: scale(1); transform-origin: 100% 75%; }
        }
        @keyframes ktl-bounce {
          0%, 45%, 70%, 100% { transform: scaleY(1.08); }
          49% { transform: scaleY(0.35); }
          50% { transform: scaleY(0.2); }
          53% { transform: scaleY(0.68); }
          60% { transform: scaleY(1.22); }
          68% { transform: scaleY(1.03); }
        }
      `}</style>
      
      <div className="relative">
        {/* The dynamic kinetic orbiting dot */}
        <div 
          className="absolute z-10 top-[35%] left-[50%] w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] pointer-events-none"
          style={{ animation: "ktl-dotMove 2000ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" }}
        />
        
        <p 
          className={cn(
            "relative m-0 whitespace-nowrap font-bold text-zinc-900 dark:text-zinc-100",
            sizeClasses[size]
          )} 
          aria-label={text}
        >
          {letters.map((char, index) => {
            const isFirst = index === 0;
            const isMiddle = index === Math.floor(letters.length / 2);

            return (
              <span 
                key={index} 
                className={cn(
                  "inline-block relative transform origin-[50%_70%]",
                  isFirst && "origin-[100%_70%]"
                )}
                style={{ 
                  animation: isFirst 
                    ? "ktl-bounce 2000ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" 
                    : isMiddle 
                    ? "ktl-letterStretch 2000ms cubic-bezier(0.25,0.23,0.73,0.75) infinite" 
                    : undefined 
                }}
              >
                {char}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export default KineticTextLoader;
