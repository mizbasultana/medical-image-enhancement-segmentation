import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  const stages = [
    "Initializing AI Engine",
    "Loading Neural Models",
    "Calibrating GPU",
    "Establishing Secure Connection",
    "Ready",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 4 + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setStage(Math.min(Math.floor(progress / 20), stages.length - 1));
  }, [progress]);

  const handleEnter = useCallback(() => {
    onComplete();
    navigate("/dashboard");
  }, [onComplete, navigate]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy-950"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-radial" />

      {/* Floating glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]"
      />

      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8"
      >
        <div className="relative h-28 w-28">
          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 112 112" className="h-full w-full">
              <circle cx="56" cy="56" r="52" fill="none" stroke="url(#ring-grad)" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round" />
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="112" y2="112">
                  <stop stopColor="#22D3EE" />
                  <stop offset="0.5" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* MRI scan effect */}
          <div className="absolute inset-3 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-navy-900" />
            {/* Brain silhouette */}
            <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full opacity-40">
              <path d="M40 20 C 25 20, 18 32, 20 46 C 22 56, 30 64, 38 66 L 38 40 Z" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.5" />
              <path d="M40 20 C 55 20, 62 32, 60 46 C 58 56, 50 64, 42 66 L 42 40 Z" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.5" />
            </svg>
            {/* Scanning line */}
            <motion.div
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]"
            />
            {/* Corner brackets */}
            <div className="absolute top-1 left-1 h-3 w-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl" />
            <div className="absolute top-1 right-1 h-3 w-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr" />
            <div className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl" />
            <div className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br" />
          </div>
        </div>
      </motion.div>

      {/* Logo text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight">
          <span className="text-gradient-cyan">MedhaDrishti</span>{" "}
          <span className="text-foreground">AI</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase">
          Intelligent MRI Analysis Platform
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-72 max-w-[80vw]"
      >
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{stages[stage]}</span>
          <span className="font-mono text-cyan-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Stage indicators */}
        <div className="mt-3 flex justify-center gap-1.5">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              animate={i <= stage ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0.3 }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400"
            />
          ))}
        </div>
      </motion.div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleEnter}
        className="absolute bottom-8 right-8 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip intro →
      </motion.button>
    </motion.div>
  );
}
