import { motion } from "framer-motion";
import {
  Brain,
  ScanLine,
  Sparkles,
  Scissors,
  Target,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ResultSummaryProps {
  mriType: string;
  detectedRegion: string;
  enhancementComplete: boolean;
  segmentationComplete: boolean;
  confidence: number;
  recommendation: string;
  className?: string;
}

export function ResultSummary({
  mriType,
  detectedRegion,
  enhancementComplete,
  segmentationComplete,
  confidence,
  recommendation,
  className,
}: ResultSummaryProps) {
  const items = [
    { label: "MRI Type", value: mriType, icon: Brain, color: "text-cyan-400" },
    { label: "Detected Region", value: detectedRegion, icon: ScanLine, color: "text-blue-400" },
    { label: "Enhancement", value: enhancementComplete ? "Complete" : "Pending", icon: Sparkles, color: enhancementComplete ? "text-emerald-400" : "text-muted-foreground" },
    { label: "Segmentation", value: segmentationComplete ? "Complete" : "Pending", icon: Scissors, color: segmentationComplete ? "text-emerald-400" : "text-muted-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("glass-card p-5 space-y-4", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <Stethoscope size={16} className="text-cyan-400" />
          Result Summary
        </h3>
        <Badge variant="success">
          <CheckCircle2 size={10} className="mr-1" /> Analysis Complete
        </Badge>
      </div>

      {/* Summary items */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
              <item.icon size={12} className={item.color} />
              {item.label}
            </div>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Confidence highlight */}
      <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Target className="text-cyan-400" size={22} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Confidence Score</p>
          <p className="text-2xl font-mono font-bold text-cyan-300">{confidence.toFixed(1)}%</p>
        </div>
      </div>

      {/* Clinical recommendation */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope size={14} className="text-emerald-400" />
          <p className="text-xs font-medium text-foreground">Clinical Recommendation</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{recommendation}</p>
      </div>
    </motion.div>
  );
}
