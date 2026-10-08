import { memo, forwardRef, type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

// ============================================================================
// LiquidMetal - Base shader wrapper component
// ============================================================================

export interface LiquidMetalProps {
  /** Base background color of the liquid metal */
  colorBack?: string;
  /** Tint/highlight color for the chrome effect */
  colorTint?: string;
  /** Animation speed (0.1 - 2.0 recommended) */
  speed?: number;
  /** Pattern complexity/repetition (1 - 10) */
  repetition?: number;
  /** Wave distortion amount (0 - 1) */
  distortion?: number;
  /** Texture scale */
  scale?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
  colorBack = "#8a8d93",
  colorTint = "#ffffff",
  speed = 0.5,
  repetition = 4,
  distortion = 0.12,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}
      style={style}
    >
      <LiquidMetalShader
        colorBack={colorBack}
        colorTint={colorTint}
        speed={speed}
        repetition={repetition}
        distortion={distortion}
        softness={0}
        shiftRed={0.3}
        shiftBlue={-0.3}
        angle={45}
        shape="none"
        scale={scale}
        fit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});

LiquidMetal.displayName = "LiquidMetal";

// ============================================================================
// LiquidMetalButton - Premium button with liquid metal border effect
// ============================================================================

export interface LiquidMetalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Optional icon displayed on the left */
  icon?: ReactNode;
  /** Border width in pixels */
  borderWidth?: number;
  /** Configuration for the LiquidMetal shader */
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Style variant */
  variant?: "dark" | "glass" | "white";
  /** Additional styling on the inner button body */
  contentClassName?: string;
}

export const LiquidMetalButton = forwardRef<HTMLButtonElement, LiquidMetalButtonProps>(
  (
    {
      children,
      icon,
      borderWidth = 2,
      metalConfig,
      size = "md",
      variant = "dark",
      className,
      contentClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: icon ? "h-9 py-1.5 pl-2 pr-4 gap-2 text-xs" : "h-9 py-1.5 px-4 gap-2 text-xs",
      md: icon ? "h-11 py-2 pl-2.5 pr-5 gap-2.5 text-sm" : "h-11 py-2 px-6 gap-2 text-sm",
      lg: icon ? "h-13 py-3 pl-3.5 pr-7 gap-3.5 text-base" : "h-13 py-3 px-8 gap-3 text-base",
    };

    const iconSizes = {
      sm: "w-6 h-6",
      md: "w-7 h-7",
      lg: "w-9 h-9",
    };

    const variantStyles = {
      dark: "bg-zinc-950 text-white dark:bg-black dark:text-zinc-100 group-hover:bg-zinc-900",
      glass: "bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
      white: "bg-white text-zinc-950 group-hover:bg-white/95 shadow-md",
    };

    const iconVariantStyles = {
      dark: "bg-zinc-900 text-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]",
      glass: "bg-white/25 text-white backdrop-blur-md shadow-sm border border-white/30",
      white: "bg-zinc-100 text-zinc-900 shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-all hover:scale-102 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <div
          className="relative rounded-full overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)]"
          style={{ padding: borderWidth }}
        >
          {/* Liquid Metal Border Layer */}
          <LiquidMetal
            colorBack={metalConfig?.colorBack ?? (variant === "white" ? "#94a3b8" : variant === "glass" ? "#94a3b8" : "#70737a")}
            colorTint={metalConfig?.colorTint ?? "#ffffff"}
            speed={metalConfig?.speed ?? 0.6}
            repetition={metalConfig?.repetition ?? 4}
            distortion={metalConfig?.distortion ?? 0.18}
            scale={metalConfig?.scale ?? 1}
            className="absolute inset-0 z-0 rounded-full"
          />

          {/* Inner Button Body */}
          <div
            className={cn(
              "relative z-10 rounded-full flex items-center justify-center font-medium tracking-tight transition-colors duration-200",
              variantStyles[variant],
              sizeStyles[size],
              contentClassName
            )}
          >
            {icon && (
              <div
                className={cn(
                  "rounded-full flex items-center justify-center shrink-0",
                  iconVariantStyles[variant],
                  iconSizes[size]
                )}
              >
                {icon}
              </div>
            )}
            <span className="font-semibold tracking-tight">
              {children}
            </span>
          </div>
        </div>
      </button>
    );
  }
);

LiquidMetalButton.displayName = "LiquidMetalButton";

export default LiquidMetal;
