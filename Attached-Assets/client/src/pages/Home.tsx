import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useScores, useCreateScore } from "@/hooks/use-scores";
import { 
  TILES, QUESTIONS, buildDecisionsByTile, 
  type Tier, type Tile 
} from "@/lib/game-data";
import { GameBoard } from "@/components/GameBoard";
import { PlayerStats } from "@/components/PlayerStats";
import { GameModal, type ModalType } from "@/components/GameModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dices, RotateCcw, Save, Trophy, ArrowRight, User, Activity,
  Sparkles, Zap, Target, Crown, Play, ChevronRight, Star,
  Pause, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOAL_PASSIVE = 200;

interface GameState {
  status: "setup" | "playing" | "paused" | "won";
  tier: Tier;
  pos: number;
  cash: number;
  passiveIncome: number;
  score: number;
  streak: number;
  bestStreak: number;
  coins: number;
  xp: number;
  lastRoll: number | null;
  turnMoved: boolean;
  turnResolved: boolean;
  logs: string[];
}

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  description: string;
  question?: any;
  decision?: any;
  result: { success: boolean; message: string; explanation: string } | null;
}

// Animated background particles
function ParticleBackground() {
  return (
    <div className="particles-bg">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            opacity: Math.random() * 0.5 + 0.2,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
        />
      ))}
    </div>
  );
}

// Floating icon component
function FloatingIcon({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

// Difficulty card component
function DifficultyCard({ tier, onClick, delay }: { tier: Tier; onClick: () => void; delay: number }) {
  const config = {
    kids: {
      title: "Kids",
      subtitle: "Ages 6-12",
      description: "Learn the basics of saving, spending, and simple money concepts.",
      icon: <Star className="w-8 h-8" />,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/30",
      border: "border-emerald-500/30",
    },
    teens: {
      title: "Teens",
      subtitle: "Ages 13-17",
      description: "Explore budgeting, credit, investing basics, and smart money habits.",
      icon: <Zap className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-600",
      glow: "shadow-blue-500/30",
      border: "border-blue-500/30",
    },
    adults: {
      title: "Adults",
      subtitle: "Ages 18+",
      description: "Master advanced topics: taxes, real estate, options, and wealth building.",
      icon: <Crown className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/30",
      border: "border-purple-500/30",
    },
  };

  const c = config[tier];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group w-full p-6 rounded-2xl text-left
        bg-gradient-to-br from-white/5 to-white/[0.02]
        border ${c.border} hover:border-white/30
        backdrop-blur-sm transition-all duration-300
        hover:shadow-2xl hover:${c.glow}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Icon */}
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${c.gradient} text-white mb-4 shadow-lg ${c.glow}`}>
        {c.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold font-display text-white mb-1">{c.title}</h3>
      <p className="text-sm text-gray-400 mb-3">{c.subtitle}</p>
      <p className="text-sm text-gray-300 leading-relaxed">{c.description}</p>

      {/* Play indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
        <Play className="w-4 h-4" />
        <span>Start Game</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}

// Pause Menu Component
function PauseMenu({ onResume, onQuit }: {
  onResume: () => void;
  onQuit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-morphism rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Pause className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h2 className="text-2xl font-bold font-display text-white mb-2">Game Paused</h2>
        <p className="text-gray-400 mb-8">Take a break and come back when you're ready!</p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onResume}
            className="w-full h-12 btn-primary text-lg font-bold"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume Game
          </Button>
          
          <Button
            onClick={onQuit}
            variant="ghost"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <X className="w-5 h-5 mr-2" />
            Quit to Menu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    status: "setup",
    tier: "teens",
    pos: 1,
    cash: 500,
    passiveIncome: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    coins: 0,
    xp: 0,
    lastRoll: null,
    turnMoved: false,
    turnResolved: false,
    logs: ["Welcome to Wealth Quest! Select your difficulty to begin."]
  });

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "info",
    title: "",
    description: "",
    result: null
  });

  const [playerName, setPlayerName] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const { data: highScores } = useScores();
  const createScore = useCreateScore();
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Pause game
  const pauseGame = () => {
    setGameState(prev => ({ ...prev, status: "paused" }));
  };

  // Resume game
  const resumeGame = () => {
    setGameState(prev => ({ ...prev, status: "playing" }));
  };

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.logs]);

  const addLog = (msg: string) => {
    setGameState(prev => ({ ...prev, logs: [...prev.logs, msg] }));
  };

  const startGame = (tier: Tier) => {
    setGameState({
      status: "playing",
      tier,
      pos: 1,
      cash: 500,
      passiveIncome: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      coins: 0,
      xp: 0,
      lastRoll: null,
      turnMoved: false,
      turnResolved: false,
      logs: [`Started new game (${tier}). Start Cash: $500.`]
    });
  };

  const quitGame = () => {
    setGameState(prev => ({ ...prev, status: "setup" }));
  };

  const rollAndMove = () => {
    if (gameState.turnMoved) return;

    setIsRolling(true);
    
    // Animate dice roll
    setTimeout(() => {
      const roll = 1 + Math.floor(Math.random() * 3);
      const income = gameState.passiveIncome;
      let newCash = gameState.cash + income;
      let newScore = gameState.score;

      addLog(`🎲 Rolled ${roll}.`);
      if (income > 0) {
        addLog(`💸 Passive Income collected: +$${income}`);
        newScore += Math.ceil(income / 10);
      }

      let newPos = gameState.pos + roll;
      if (newPos > TILES.length) {
        newPos = newPos - TILES.length;
        newCash += 200;
        newScore += 10;
        addLog("✅ Passed Start: Payday +$200!");
      }

      const tile = TILES.find(t => t.id === newPos)!;
      addLog(`📍 Moved to tile #${newPos}: ${tile.label}`);

      setGameState(prev => ({
        ...prev,
        lastRoll: roll,
        pos: newPos,
        cash: newCash,
        score: newScore,
        turnMoved: true,
        turnResolved: false
      }));

      setIsRolling(false);
    }, 600);
  };

  const resolveTile = () => {
    const tile = TILES.find(t => t.id === gameState.pos)!;
    const tierQuestions = QUESTIONS[gameState.tier];

    if (tile.type === "start") {
      const bonus = 150;
      setGameState(prev => ({
        ...prev,
        cash: prev.cash + bonus,
        score: prev.score + 8,
        turnResolved: true
      }));
      addLog(`💰 Landed on Start! Bonus +$${bonus}`);
      setModalState({
        isOpen: true,
        type: "start",
        title: "Payday!",
        description: `You landed on Start. You earned $${bonus} for showing up.`,
        result: null
      });
      return;
    }

    const randQ = tierQuestions[Math.floor(Math.random() * tierQuestions.length)];
    
    if (tile.type === "decision") {
      const decision = buildDecisionsByTile(tile.id, gameState.tier);
      setModalState({
        isOpen: true,
        type: "decision",
        title: "Make a Choice",
        description: decision.prompt,
        decision,
        result: null
      });
    } else {
      let title = "Trivia Challenge";
      let desc = "Answer correctly to earn cash.";
      
      if (tile.type === "invest") {
        title = "Investment Opportunity";
        desc = "Correct answer unlocks passive income!";
      } else if (tile.type === "risk") {
        title = "Risk Management";
        desc = "Correct answer minimizes loss.";
      }

      setModalState({
        isOpen: true,
        type: tile.type,
        title,
        description: desc,
        question: randQ,
        result: null
      });
    }
  };

  const handleAnswer = (idx: number) => {
    const tile = TILES.find(t => t.id === gameState.pos)!;
    let cashChange = 0;
    let piChange = 0;
    let scoreChange = 0;
    let success = false;
    let message = "";
    let explanation = "";

    const applyStreakAndRewards = (isCorrect: boolean, rewardCash: number) => {
      setGameState(prev => {
        const nextStreak = isCorrect ? prev.streak + 1 : 0;
        const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
        const mult = 1 + Math.min(1, nextStreak * 0.10);
        const cashGain = Math.round(rewardCash * mult);
        const coinGain = isCorrect ? (5 + Math.min(20, nextStreak)) : 0;
        const xpGain = isCorrect ? 10 : 0;

        return {
          ...prev,
          streak: nextStreak,
          bestStreak: nextBestStreak,
          cash: prev.cash + cashGain,
          coins: prev.coins + coinGain,
          xp: prev.xp + xpGain,
        };
      });
    };

    if (tile.type === "decision") {
      const decision = modalState.decision!;
      const choice = decision.choices[idx];
      
      cashChange = choice.cashDelta;
      piChange = choice.passiveDelta;
      scoreChange = choice.scoreDelta;
      explanation = choice.explain;
      
      success = (cashChange + piChange >= 0 || scoreChange > 0);
      
      message = `${choice.label} selected. `;
      if(cashChange !== 0) message += `Cash: ${cashChange > 0 ? '+' : ''}${cashChange}. `;
      if(piChange !== 0) message += `Passive: ${piChange > 0 ? '+' : ''}${piChange}. `;

    } else {
      const question = modalState.question!;
      const isCorrect = idx === question.correct;
      explanation = question.exp;
      success = isCorrect;

      if (isCorrect) {
        scoreChange += 15;
        if (tile.type === "invest") {
          cashChange = 90;
          const piReward = gameState.tier === "kids" ? 20 : gameState.tier === "teens" ? 35 : 50;
          piChange = piReward;
          message = `Correct! You secured the investment.`;
        } else if (tile.type === "risk") {
          cashChange = 70;
          message = `Correct! You managed the risk well.`;
        } else {
          cashChange = 120;
          message = `Correct! Knowledge pays off.`;
        }
      } else {
        scoreChange -= 8;
        if (tile.type === "risk") {
          cashChange = -140;
          message = `Incorrect. The risk event hit hard.`;
        } else {
          cashChange = -80;
          message = `Incorrect. Missed opportunity.`;
        }
      }

      applyStreakAndRewards(isCorrect, cashChange);
      cashChange = 0;
    }

    setGameState(prev => {
      const nextCash = prev.cash + cashChange;
      const nextPi = prev.passiveIncome + piChange;
      const nextScore = Math.max(0, prev.score + scoreChange);
      
      if (nextPi >= GOAL_PASSIVE) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setGameState(s => ({ ...s, status: "won" })), 1500);
      }

      return {
        ...prev,
        cash: nextCash,
        passiveIncome: nextPi,
        score: nextScore,
        turnResolved: true
      };
    });

    addLog(message);

    setModalState(prev => ({
      ...prev,
      result: { success, message, explanation }
    }));
  };

  const endTurn = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    setGameState(prev => ({
      ...prev,
      lastRoll: null,
      turnMoved: false,
      turnResolved: false
    }));
    addLog("--- Turn Ended ---");
  };

  const submitScore = async () => {
    if (!playerName.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    try {
      await createScore.mutateAsync({
        playerName,
        score: gameState.score,
        tier: gameState.tier,
        passiveIncome: gameState.passiveIncome,
        streak: gameState.streak,
        bestStreak: gameState.bestStreak,
        coins: gameState.coins,
        xp: gameState.xp
      });
      toast({ title: "Score Saved!", description: "You are now on the leaderboard." });
      setGameState(prev => ({ ...prev, status: "setup" }));
    } catch (e) {
      toast({ title: "Error", description: "Could not save score.", variant: "destructive" });
    }
  };

  // ==================== SETUP SCREEN ====================
  if (gameState.status === "setup") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />

        {/* Floating decorations */}
        <FloatingIcon delay={0.5} className="absolute top-20 left-[10%] opacity-20">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-xl" />
        </FloatingIcon>
        <FloatingIcon delay={1} className="absolute top-40 right-[15%] opacity-20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 blur-xl" />
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="absolute bottom-40 left-[20%] opacity-15">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 blur-xl" />
        </FloatingIcon>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 mb-6"
            >
              <Sparkles className="w-12 h-12 text-cyan-400" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold font-display mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
                Wealth Quest
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Master your money mindset. Build passive income. 
              <span className="text-cyan-400 font-semibold"> Achieve financial freedom.</span>
            </motion.p>
          </motion.div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-2xl w-full mb-10 p-6 rounded-2xl glass-morphism"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-display text-white">How to Play</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">1</div>
                <p>Roll the dice to move around the board</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">2</div>
                <p>Answer trivia and make smart decisions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">3</div>
                <p>Earn cash and build passive income</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">★</div>
                <p><strong className="text-emerald-400">Win:</strong> Reach $200 Passive Income!</p>
              </div>
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="max-w-4xl w-full mb-12"
          >
            <h2 className="text-center text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">
              Choose Your Difficulty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["kids", "teens", "adults"] as Tier[]).map((tier, i) => (
                <DifficultyCard 
                  key={tier} 
                  tier={tier} 
                  onClick={() => startGame(tier)}
                  delay={0.8 + i * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="max-w-2xl w-full"
          >
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-lg font-bold font-display text-white">Leaderboard</h2>
                <span className="text-xs text-gray-500 ml-auto">Scores saved permanently</span>
              </div>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {highScores?.sort((a: any, b: any) => b.score - a.score).slice(0, 10).map((s: any, i: number) => (
                  <motion.div 
                    key={s.id || `score-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.05 }}
                    className={`
                      flex items-center justify-between p-3 rounded-xl transition-all
                      ${i === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30' :
                        i === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-gray-400/30' :
                        i === 2 ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-700/30' :
                        'bg-white/5 border border-white/5 hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`
                        text-sm font-mono w-6 text-center
                        ${i === 0 ? 'text-yellow-400 font-bold' : 
                          i === 1 ? 'text-gray-300 font-bold' :
                          i === 2 ? 'text-amber-600 font-bold' : 'text-gray-500'}
                      `}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <span className="font-medium text-white">{s.playerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-gray-400 uppercase font-medium">{s.tier}</span>
                      <span className="font-bold text-yellow-400 tabular-nums">{s.score}</span>
                    </div>
                  </motion.div>
                ))}
                {!highScores?.length && (
                  <div className="text-center text-gray-500 py-8">
                    <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No scores yet. Be the first!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ==================== WIN SCREEN ====================
  if (gameState.status === "won") {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <ParticleBackground />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 glass-morphism max-w-lg w-full p-8 rounded-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/30"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold font-display text-white mb-2"
          >
            Financial Freedom!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-8"
          >
            You reached <span className="text-emerald-400 font-bold">${gameState.passiveIncome}</span> passive income.
            <br />
            Final Score: <span className="text-3xl font-bold text-cyan-400">{gameState.score}</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 max-w-xs mx-auto"
          >
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Best Streak</p>
                <p className="text-2xl font-bold text-orange-400">{gameState.bestStreak}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Final Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{gameState.coins}</p>
              </div>
            </div>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Enter your name" 
                className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-gray-500 h-12"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full h-12 btn-primary text-lg"
              onClick={submitScore}
              disabled={createScore.isPending}
            >
              {createScore.isPending ? "Saving..." : "Save Score & Restart"}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => setGameState(s => ({ ...s, status: "setup" }))}
            >
              Skip & Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ==================== GAME SCREEN ====================
  const currentTile = TILES.find(t => t.id === gameState.pos);
  
  return (
    <div className="game-container">
      {/* Pause Menu Overlay */}
      <AnimatePresence>
        {gameState.status === "paused" && (
          <PauseMenu 
            onResume={resumeGame}
            onQuit={quitGame}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-white/5 bg-[#050816]/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold font-display text-white">Wealth Quest</h1>
            <span className={`
              text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide
              ${gameState.tier === 'kids' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                gameState.tier === 'teens' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-purple-500/20 text-purple-400 border border-purple-500/30'}
            `}>
              {gameState.tier}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Pause Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
              onClick={pauseGame}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={quitGame}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Quit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Stats Bar - Compact horizontal layout */}
          <PlayerStats 
            cash={gameState.cash} 
            passiveIncome={gameState.passiveIncome} 
            score={gameState.score} 
            streak={gameState.streak}
            coins={gameState.coins}
            xp={gameState.xp}
            goal={GOAL_PASSIVE}
            roll={gameState.lastRoll}
          />

          {/* Game Board */}
          <div className="glass-morphism rounded-2xl p-4 md:p-6">
            <GameBoard currentPos={gameState.pos} />
          </div>

          {/* Game Log - Compact */}
          <div className="glass-morphism rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Game Log</h3>
            </div>
            <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 text-sm">
              {gameState.logs.slice(-5).map((log, i) => (
                <div key={`log-${i}`} className="text-gray-300 text-xs border-l-2 border-white/10 pl-2 py-0.5">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Action Bar at Bottom */}
      <div className="action-bar">
        <div className="max-w-7xl mx-auto">
          {/* Current tile indicator */}
          {currentTile && (
            <div className="text-center mb-3">
              <span className="text-xs text-gray-400">Current Position:</span>
              <span className="ml-2 text-sm font-semibold text-white">{currentTile.label}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Roll Dice Button */}
            <Button 
              className={`
                flex-1 h-14 text-lg font-bold rounded-xl transition-all
                ${gameState.turnMoved 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : 'btn-primary'}
              `}
              onClick={rollAndMove}
              disabled={gameState.turnMoved || isRolling}
            >
              <motion.div
                animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0, ease: "linear" }}
                className="mr-2"
              >
                <Dices className="w-6 h-6" />
              </motion.div>
              {isRolling ? "Rolling..." : gameState.turnMoved ? `Rolled: ${gameState.lastRoll}` : "Roll Dice"}
            </Button>

            {/* Resolve Button */}
            <Button 
              className={`
                flex-1 h-14 text-lg font-bold rounded-xl transition-all
                ${!gameState.turnMoved || gameState.turnResolved
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'}
              `}
              onClick={resolveTile}
              disabled={!gameState.turnMoved || gameState.turnResolved}
            >
              {gameState.turnResolved ? (
                <>
                  <Save className="w-5 h-5 mr-2 text-emerald-400" />
                  <span className="text-emerald-400">Resolved</span>
                </>
              ) : (
                "Resolve Tile"
              )}
            </Button>

            {/* End Turn Button */}
            <Button 
              className={`
                h-14 px-6 text-lg font-bold rounded-xl transition-all
                ${!gameState.turnResolved
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}
              `}
              onClick={endTurn}
              disabled={!gameState.turnResolved}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <GameModal 
        {...modalState} 
        onClose={endTurn} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
}
