import { motion } from "framer-motion";
import { type Tile, TILES } from "@/lib/game-data";
import { DollarSign, HelpCircle, BrainCircuit, TrendingUp, AlertTriangle } from "lucide-react";

interface GameBoardProps {
  currentPos: number;
}

export function GameBoard({ currentPos }: GameBoardProps) {
  const getTileConfig = (type: Tile['type']) => {
    switch (type) {
      case "start":
        return {
          gradient: "from-emerald-500/20 to-emerald-600/5",
          border: "border-emerald-500/40",
          activeBorder: "border-emerald-400",
          glow: "shadow-emerald-500/30",
          icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
          iconBg: "bg-emerald-500/20 text-emerald-400",
          badge: "bg-emerald-500/30 text-emerald-300",
        };
      case "trivia":
        return {
          gradient: "from-blue-500/20 to-blue-600/5",
          border: "border-blue-500/40",
          activeBorder: "border-blue-400",
          glow: "shadow-blue-500/30",
          icon: <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />,
          iconBg: "bg-blue-500/20 text-blue-400",
          badge: "bg-blue-500/30 text-blue-300",
        };
      case "decision":
        return {
          gradient: "from-purple-500/20 to-purple-600/5",
          border: "border-purple-500/40",
          activeBorder: "border-purple-400",
          glow: "shadow-purple-500/30",
          icon: <BrainCircuit className="w-4 h-4 md:w-5 md:h-5" />,
          iconBg: "bg-purple-500/20 text-purple-400",
          badge: "bg-purple-500/30 text-purple-300",
        };
      case "invest":
        return {
          gradient: "from-cyan-500/20 to-teal-600/5",
          border: "border-cyan-500/40",
          activeBorder: "border-cyan-400",
          glow: "shadow-cyan-500/30",
          icon: <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />,
          iconBg: "bg-cyan-500/20 text-cyan-400",
          badge: "bg-cyan-500/30 text-cyan-300",
        };
      case "risk":
        return {
          gradient: "from-orange-500/20 to-red-600/5",
          border: "border-orange-500/40",
          activeBorder: "border-orange-400",
          glow: "shadow-orange-500/30",
          icon: <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />,
          iconBg: "bg-orange-500/20 text-orange-400",
          badge: "bg-orange-500/30 text-orange-300",
        };
      default:
        return {
          gradient: "from-gray-500/20 to-gray-600/5",
          border: "border-gray-500/40",
          activeBorder: "border-gray-400",
          glow: "shadow-gray-500/30",
          icon: null,
          iconBg: "bg-gray-500/20 text-gray-400",
          badge: "bg-gray-500/30 text-gray-300",
        };
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 md:gap-3 w-full">
      {TILES.map((tile, index) => {
        const isActive = tile.id === currentPos;
        const config = getTileConfig(tile.type);
        
        return (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className={`
              relative game-tile aspect-square p-2 md:p-3
              bg-gradient-to-br ${config.gradient}
              ${isActive 
                ? `${config.activeBorder} border-2 shadow-lg ${config.glow} scale-105 z-10` 
                : `${config.border} border opacity-75 hover:opacity-100`}
            `}
          >
            {/* Tile Number */}
            <div className="absolute top-1 left-1.5 md:top-2 md:left-2 text-[10px] md:text-xs font-bold font-display text-white/30">
              {tile.id}
            </div>

            {/* Content */}
            <div className="h-full flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div className={`p-1.5 md:p-2 rounded-lg ${config.iconBg} mb-1 md:mb-2`}>
                {config.icon}
              </div>
              
              {/* Label */}
              <h3 className="text-[9px] md:text-xs font-semibold text-white/90 leading-tight line-clamp-2">
                {tile.label}
              </h3>

              {/* Type Badge - Only on larger screens */}
              <div className={`hidden md:block mt-1.5 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${config.badge}`}>
                {tile.type}
              </div>
            </div>

            {/* Player Pawn */}
            {isActive && (
              <motion.div
                layoutId="pawn"
                className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-full border-2 md:border-4 border-[#0b1220] shadow-lg shadow-yellow-500/50 flex items-center justify-center">
                  <span className="text-base md:text-lg filter drop-shadow-md">👤</span>
                </div>
              </motion.div>
            )}
            
            {/* Active Pulse Ring */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.5, 0.2, 0.5], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-2xl border-2 ${config.activeBorder} pointer-events-none`}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
