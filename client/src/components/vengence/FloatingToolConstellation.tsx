import { motion } from "framer-motion";
import { 
  Terminal, 
  GitBranch, 
  Cpu, 
  Zap, 
  Radio, 
  Boxes, 
  Database,
  Share2
} from "lucide-react";

interface FloatingTool {
  name: string;
  icon: typeof Terminal;
  x: string;
  y: string;
  delay: number;
}

const tools: FloatingTool[] = [
  { name: "Git", icon: GitBranch, x: "-36%", y: "-38%", delay: 0 },
  { name: "CLI Terminal", icon: Terminal, x: "0%", y: "-44%", delay: 0.2 },
  { name: "WebSockets", icon: Radio, x: "36%", y: "-38%", delay: 0.4 },
  { name: "Node / Bun", icon: Zap, x: "-46%", y: "2%", delay: 0.6 },
  { name: "Rust Core", icon: Cpu, x: "46%", y: "2%", delay: 0.8 },
  { name: "P2P Mesh", icon: Share2, x: "-34%", y: "40%", delay: 1.0 },
  { name: "Distributed Cache", icon: Database, x: "0%", y: "45%", delay: 1.2 },
  { name: "Docker & SSH", icon: Boxes, x: "34%", y: "40%", delay: 1.4 },
];

export function FloatingToolConstellation() {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial soft light (matching screenshot 2) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle 300px at center, rgba(16,185,129,0.1), transparent 70%)',
        }}
      />

      {/* Orbiting / floating badges constellation container */}
      <div className="relative w-full max-w-xl h-80 sm:h-96 flex items-center justify-center my-4">
        {/* Floating circular badges (matching screenshot 2 soft white circular 3D pills) */}
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              className="absolute z-10 flex items-center justify-center pointer-events-auto"
              style={{
                left: `calc(50% + ${tool.x})`,
                top: `calc(50% + ${tool.y})`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                }}
                transition={{
                  duration: 3.5 + tool.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="group relative flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-[0_14px_36px_rgba(0,0,0,0.09)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-115 hover:border-emerald-500/60 transition-all duration-300"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700 dark:text-zinc-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                
                {/* Floating tooltip badge on hover */}
                <span className="absolute -bottom-7 px-2 py-0.5 rounded-md text-[10px] font-mono tracking-tight bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-30">
                  {tool.name}
                </span>
              </motion.div>
            </div>
          );
        })}

        {/* Center Title (exactly matching user's screenshot 2: "Works with your favorite tools...") */}
        <div className="relative z-20 text-center px-4 max-w-xs sm:max-w-sm pointer-events-none">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Works with your <span className="text-zinc-400 dark:text-zinc-500 font-medium">terminal workflow...</span>
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Instant sync across native CLI, WebSockets, Git repositories, and local daemons.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FloatingToolConstellation;
