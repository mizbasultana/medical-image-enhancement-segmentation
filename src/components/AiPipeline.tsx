import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  ScanLine,
  Waves,
  Sun,
  Target,
  Scissors,
  Eye,
  FileText,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PipelineStep {
  id: number;
  label: string;
  description: string;
  icon: typeof FileCheck2;
  duration: number;
}

const pipelineSteps: PipelineStep[] = [
  { id: 1, label: "Dataset Validation", description: "Verifying DICOM headers, voxel spacing, and image dimensions", icon: FileCheck2, duration: 800 },
  { id: 2, label: "MRI Preprocessing", description: "N4 bias field correction and skull stripping", icon: ScanLine, duration: 1000 },
  { id: 3, label: "Noise Reduction", description: "Deep learning denoising with residual U-Net", icon: Waves, duration: 900 },
  { id: 4, label: "Contrast Enhancement", description: "CLAHE + Vision Transformer super-resolution", icon: Sun, duration: 1100 },
  { id: 5, label: "ROI Detection", description: "Attention-based region of interest localization", icon: Target, duration: 850 },
  { id: 6, label: "Segmentation", description: "Attention U-Net pixel-wise tissue classification", icon: Scissors, duration: 1200 },
  { id: 7, label: "Grad-CAM Explainability", description: "Gradient-weighted class activation mapping", icon: Eye, duration: 950 },
  { id: 8, label: "Clinical Report Generation", description: "Structured findings and clinical recommendations", icon: FileText, duration: 700 },
];

interface AiPipelineProps {
  active: boolean;
  onComplete: () => void;
}

export function AiPipeline({ active, onComplete }: AiPipelineProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepTimes, setStepTimes] = useState<Record<number, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!active) {
      setCurrentStep(-1);
      setCompletedSteps([]);
      setStepTimes({});
      setOverallProgress(0);
      return;
    }

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= pipelineSteps.length) {
        onComplete();
        return;
      }
      const step = pipelineSteps[stepIndex];
      setCurrentStep(stepIndex);
      const startTime = Date.now();

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / step.duration) * 100, 100);
        setOverallProgress(((stepIndex + pct / 100) / pipelineSteps.length) * 100);
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        const elapsed = Date.now() - startTime;
        setStepTimes((prev) => ({ ...prev, [step.id]: elapsed }));
        setCompletedSteps((prev) => [...prev, step.id]);
        stepIndex++;
        runStep();
      }, step.duration);
      timeoutsRef.current.push(timeout);
    };

    runStep();

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-navy-950/90 backdrop-blur-md p-4"
    >
      <div className="w-full max-w-2xl glass-strong rounded-2xl border border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20"
          >
            <Loader2 className="text-cyan-400" size={20} />
          </motion.div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">AI Pipeline Processing</h2>
            <p className="text-xs text-muted-foreground">Real-time inference across 8 stages</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-mono font-bold text-cyan-300">{Math.round(overallProgress)}%</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06] mb-6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {pipelineSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentStep === index && !isCompleted;
            const isPending = !isCompleted && !isActive;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3.5 transition-all",
                  isCompleted
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : isActive
                    ? "border-cyan-500/40 bg-cyan-500/10"
                    : "border-white/[0.06] bg-white/[0.02] opacity-50"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="text-emerald-400" size={20} />
                  ) : isActive ? (
                    <Loader2 className="text-cyan-400 animate-spin" size={20} />
                  ) : (
                    <step.icon className="text-muted-foreground" size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{String(step.id).padStart(2, "0")}</span>
                    <p className={cn("text-sm font-medium", isCompleted ? "text-foreground" : isActive ? "text-cyan-300" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{step.description}</p>
                </div>
                <div className="text-right shrink-0">
                  {isCompleted ? (
                    <span className="text-xs font-mono text-emerald-300">
                      {stepTimes[step.id] ? `${(stepTimes[step.id] / 1000).toFixed(2)}s` : ""}
                    </span>
                  ) : isActive ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-xs font-mono text-cyan-300"
                    >
                      processing...
                    </motion.span>
                  ) : (
                    <ChevronRight className="text-muted-foreground" size={14} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <AnimatePresence>
          {completedSteps.length === pipelineSteps.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
            >
              <CheckCircle2 className="text-emerald-400" size={24} />
              <div>
                <p className="text-sm font-semibold text-foreground">Pipeline Complete</p>
                <p className="text-xs text-muted-foreground">
                  Total processing time: {Object.values(stepTimes).reduce((a, b) => a + b, 0) / 1000 | 0}.{Object.values(stepTimes).reduce((a, b) => a + b, 0) % 1000 | 0}s
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
