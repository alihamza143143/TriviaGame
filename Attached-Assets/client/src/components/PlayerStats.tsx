import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Trophy, Flame, Coins, Star, Target } from "lucide-react";

interface PlayerStatsProps {
  cash: number;
  passiveIncome: number;
  score: number;
  streak: number;
  coins: number;
  xp: number;
  goal: number;
  roll: number | null;
}

export function PlayerStats({ cash, passiveIncome, score, streak, coins, xp, goal, roll }: PlayerStatsProps) {
  const progress = Math.min(100, (passiveIncome / goal) * 100);

  const formatMoney = (n: number) => 
    (n < 0 ? "-" : "") + "$" + Math.abs(n).toLocaleString();

  return (
    <div className="glass-morphism rounded-xl p-3 md:p-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {/* Cash */}
        <motion.div 
          key={`cash-${cash}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          className="stat-card p-2 md:p-3"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-emerald-400/80 font-semibold uppercase tracking-wide truncate">Cash</p>
              <p className={`text-sm md:text-lg font-bold font-display truncate ${cash < 0 ? 'text-red-400' : 'text-white'}`}>
                {formatMoney(cash)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Passive Income with Progress */}
        <motion.div 
          key={`passive-${passiveIncome}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          className="stat-card p-2 md:p-3 col-span-2 md:col-span-1"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 md:p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] md:text-xs text-cyan-400/80 font-semibold uppercase tracking-wide truncate">Passive</p>
              <p className="text-sm md:text-lg font-bold font-display text-white">
                {formatMoney(passiveIncome)}
                <span className="text-[10px] md:text-xs text-gray-500 font-normal ml-1">/ {formatMoney(goal)}</span>
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 md:h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress >= 100 
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                  : progress >= 75 
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-500'
                    : progress >= 50
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                      : 'bg-gradient-to-r from-blue-500 to-blue-400'
              }`}
              style={{
                boxShadow: progress >= 50 ? '0 0 10px currentColor' : 'none'
              }}
            />
          </div>
        </motion.div>

        {/* Score */}
        <motion.div 
          key={`score-${score}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          className="stat-card p-2 md:p-3"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-yellow-500/20 text-yellow-400 shrink-0">
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-yellow-400/80 font-semibold uppercase tracking-wide truncate">Score</p>
              <p className="text-sm md:text-lg font-bold font-display text-white">{score}</p>
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div 
          key={`streak-${streak}`}
          initial={{ scale: 1 }}
          animate={{ scale: streak > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="stat-card p-2 md:p-3"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${streak > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
              <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-orange-400/80 font-semibold uppercase tracking-wide truncate">Streak</p>
              <p className={`text-sm md:text-lg font-bold font-display ${streak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                {streak > 0 ? `${streak}x` : '-'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Coins */}
        <div className="stat-card p-2 md:p-3 hidden md:block">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Coins className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-amber-400/80 font-semibold uppercase tracking-wide truncate">Coins</p>
              <p className="text-sm md:text-lg font-bold font-display text-white">{coins}</p>
            </div>
          </div>
        </div>

        {/* XP */}
        <div className="stat-card p-2 md:p-3 hidden md:block">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-purple-400/80 font-semibold uppercase tracking-wide truncate">XP</p>
              <p className="text-sm md:text-lg font-bold font-display text-white">{xp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only: Secondary stats row */}
      <div className="grid grid-cols-2 gap-2 mt-2 md:hidden">
        <div className="flex items-center justify-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-white font-medium">{coins}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-white font-medium">{xp} XP</span>
          </div>
        </div>
        
        {/* Dice Roll Display - Mobile */}
        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-dashed border-white/10">
          <Target className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Roll:</span>
          <span className="text-lg font-bold font-display text-white">{roll ?? '-'}</span>
        </div>
      </div>
    </div>
  );
}
