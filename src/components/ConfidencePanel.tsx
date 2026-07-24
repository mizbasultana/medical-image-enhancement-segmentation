import { motion } from "framer-motion";
import {
  Target,
  ShieldCheck,
  Zap,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Progress } from "@/components/ui/progress";

type RiskLevel = "Low" | "Medium" | "High";

interface ConfidencePanelProps {
  confidence: number;
  riskLevel: RiskLevel;
  inferenceTime: number;
  modelVersion: string;
  gpuUsage: number;
  memoryUsage: number;
  status: "operational" | "degraded" | "down";
  className?: string;
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; border: string; icon: typeof ShieldCheck }> = {
  Low: { color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20", icon: ShieldCheck },
  Medium: { color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20", icon: AlertTriangle },
  High: { color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: AlertCircle },
};

const statusConfig = {
  operational: { label: "Operational", color: "text-emerald-400", dot: "bg-emerald-400" },
  degraded: { label: "Degraded", color: "text-amber-400", dot: "bg-amber-400" },
  down: { label: "Offline", color: "text-rose-400", dot: "bg-rose-400" },
};

export function ConfidencePanel({
  confidence,
  riskLevel,
  inferenceTime,
  modelVersion,
  gpuUsage,
  memoryUsage,
  status,
  className,
}: ConfidencePanelProps) {
  const risk = riskConfig[riskLevel];
  const RiskIcon = risk.icon;
  const stat = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("glass-card p-5 space-y-4", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground">AI Confidence Panel</h3>
        <span className="flex items-center gap-1.5 text-xs">
          <span className={cn("h-2 w-2 rounded-full animate-pulse", stat.dot)} />
          <span className={stat.color}>{stat.label}</span>
        </span>
      </div>

      {/* Overall confidence gauge */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#conf-grad-panel)" strokeWidth="7"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 264" }}
              animate={{ strokeDasharray: `${2 * Math.PI * 42 * (confidence / 100)} 264` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="conf-grad-panel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <AnimatedCounter value={confidence} decimals={1} suffix="%" className="text-lg font-mono font-bold text-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Overall Confidence</p>
          <p className="text-sm font-medium text-foreground">Model prediction certainty</p>
        </div>
      </div>

      {/* Risk level */}
      <div className={cn("flex items-center gap-3 rounded-xl border p-3", risk.bg, risk.border)}>
        <RiskIcon className={risk.color} size={20} />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <p className={cn("text-sm font-bold", risk.color)}>{riskLevel}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Zap size={12} /> Inference
          </div>
          <p className="text-sm font-mono font-bold text-foreground">
            <AnimatedCounter value={inferenceTime} suffix="ms" />
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Target size={12} /> Model
          </div>
          <p className="text-sm font-mono font-bold text-foreground">{modelVersion}</p>
        </div>
      </div>

      {/* GPU + Memory bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Cpu size={12} /> GPU Usage</span>
            <span className="font-mono text-cyan-300"><AnimatedCounter value={gpuUsage} suffix="%" /></span>
          </div>
          <Progress value={gpuUsage} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground"><HardDrive size={12} /> Memory</span>
            <span className="font-mono text-cyan-300"><AnimatedCounter value={memoryUsage} suffix="%" /></span>
          </div>
          <Progress value={memoryUsage} indicatorClassName="bg-gradient-to-r from-emerald-400 to-teal-500" />
        </div>
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className={stat.color} />
          <span className="text-xs text-muted-foreground">System Status</span>
        </div>
        <span className={cn("text-xs font-medium", stat.color)}>{stat.label}</span>
      </div>
    </motion.div>
  );
}
