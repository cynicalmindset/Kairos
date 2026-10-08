import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CursorCardProps {
  children: React.ReactNode;
  image: string;
  description: string;
  title?: string;
  badge?: string;
  href?: string;
  className?: string;
  cardClassName?: string;
}

export function CursorCard({
  children,
  image,
  description,
  title,
  badge,
  href = "#",
  className,
  cardClassName,
}: CursorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 280, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX - 130); // Center horizontally (width 260 / 2)
    y.set(e.clientY + 18);  // Slightly below cursor
  };

  return (
    <>
      <a
        href={href}
        className={cn(
          "relative inline-block transition-all duration-200 cursor-pointer",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              style={{
                x: springX,
                y: springY,
              }}
              className={cn(
                "fixed top-0 left-0 pointer-events-none z-[99999] w-[260px]",
                "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-3 shadow-2xl rounded-2xl",
                "border border-zinc-200/80 dark:border-zinc-800/80 text-left overflow-hidden",
                cardClassName
              )}
            >
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                <img
                  src={image}
                  alt={title || "Preview"}
                  className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                />
                {badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded-full bg-black/60 backdrop-blur text-white border border-white/10">
                    {badge}
                  </span>
                )}
              </div>
              {title && (
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5 tracking-tight">
                  {title}
                </h4>
              )}
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 m-0 leading-relaxed font-normal">
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default CursorCard;
