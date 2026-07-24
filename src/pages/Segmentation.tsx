import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Play,
  Download,
  Layers,
  Brain,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Grid3x3,
  Gauge,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { segmentationMetrics } from "@/data/mock";

interface SegClass {
  name: string;
  color: string;
  coverage: number;
  visible: boolean;
}

const initialClasses: SegClass[] = [
  { name: "Tumor", color: "#EF4444", coverage: 3.9, visible: true },
  { name: "Edema", color: "#F59E0B", coverage: 7.2, visible: true },
  { name: "Gray Matter", color: "#22D3EE", coverage: 28.1, visible: true },
  { name: "White Matter", color: "#3B82F6", coverage: 18.5, visible: true },
  { name: "CSF", color: "#34D399", coverage: 7.2, visible: true },
  { name: "Spinal Disc", color: "#A78BFA", coverage: 4.1, visible: true },
];

const metricsList = [
  { key: "dice", label: "Dice Score", desc: "Overlap similarity coefficient", color: "text-cyan-400" },
  { key: "jaccard", label: "Jaccard", desc: "Intersection over Union", color: "text-blue-400" },
  { key: "accuracy", label: "Accuracy", desc: "Pixel-wise correctness", color: "text-emerald-400" },
  { key: "precision", label: "Precision", desc: "True positive ratio", color: "text-violet-400" },
  { key: "recall", label: "Recall", desc: "True positive rate", color: "text-amber-400" },
  { key: "sensitivity", label: "Sensitivity", desc: "True positive proportion", color: "text-rose-400" },
  { key: "specificity", label: "Specificity", desc: "True negative rate", color: "text-teal-400" },
  { key: "f1", label: "F1 Score", desc: "Harmonic mean of precision and recall", color: "text-sky-400" },
];

function ConfidenceGauge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const angle = (pct / 100) * 180 - 90;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <defs>
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
          <path d="M 10 70 A 70 70 0 0 1 150 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
          <path
            d="M 10 70 A 70 70 0 0 1 150 70"
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={220 - (220 * pct) / 100}
            className="transition-all duration-1000"
          />
          <g transform={`rotate(${angle} 80 70)`}>
            <line x1="80" y1="70" x2="80" y2="30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="70" r="4" fill="#fff" />
          </g>
        </svg>
      </div>
      <p className="text-2xl font-mono font-bold text-white -mt-2">{pct}%</p>
      <p className="text-xs text-slate-500 mt-0.5">Prediction Confidence</p>
    </div>
  );
}

export function Segmentation() {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [classes, setClasses] = useState(initialClasses);
  const [opacity, setOpacity] = useState(0.5);
  const [showMask, setShowMask] = useState(true);

  const handleProcess = () => {
    setProcessing(true);
    setDone(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setDone(true);
          return 100;
        }
        return p + Math.random() * 10;
      });
    }, 180);
  };

  const toggleClass = (name: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.name === name ? { ...c, visible: !c.visible } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Segmentation viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Segmented MRI</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Attention-UNet pixel-wise classification with mask overlay
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {done && (
                    <Badge variant="success">
                      <CheckCircle2 size={12} className="mr-1" /> Dice {segmentationMetrics.dice}
                    </Badge>
                  )}
                  <Button
                    variant={showMask ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setShowMask(!showMask)}
                    disabled={!done}
                  >
                    {showMask ? <Eye size={14} className="mr-1" /> : <EyeOff size={14} className="mr-1" />}
                    {showMask ? "Mask On" : "Mask Off"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden border border-white/[0.06] bg-navy-900">
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/80 backdrop-blur-sm z-10">
                    <Loader2 className="text-cyan-400 animate-spin" size={28} />
                    <p className="text-sm text-slate-300">Segmenting ROIs...</p>
                    <Progress value={progress} className="w-2/3" />
                    <p className="text-xs font-mono text-cyan-300">
                      {Math.round(Math.min(100, progress))}%
                    </p>
                  </div>
                )}

                {/* Base brain image */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 45%, rgba(100,130,180,0.2), rgba(11,18,32,0.95) 75%)",
                  }}
                />
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                  <path d="M100 45 C 60 45, 45 80, 50 115 C 53 140, 70 158, 95 162 L 95 100 Z" fill="rgba(120,150,200,0.15)" stroke="rgba(120,150,200,0.3)" strokeWidth="0.5" />
                  <path d="M100 45 C 140 45, 155 80, 150 115 C 147 140, 130 158, 105 162 L 105 100 Z" fill="rgba(120,150,200,0.15)" stroke="rgba(120,150,200,0.3)" strokeWidth="0.5" />

                  {/* Mask overlays */}
                  {done && showMask && (
                    <g style={{ opacity }}>
                      {/* Gray Matter */}
                      {classes[2].visible && (
                        <path d="M100 50 C 70 50, 55 78, 58 108 C 60 125, 72 140, 90 145 L 90 95 Z" fill="rgba(34,211,238,0.35)" stroke="#22D3EE" strokeWidth="1" />
                      )}
                      {/* White Matter */}
                      {classes[3].visible && (
                        <path d="M100 50 C 130 50, 145 78, 142 108 C 140 125, 128 140, 110 145 L 110 95 Z" fill="rgba(59,130,246,0.35)" stroke="#3B82F6" strokeWidth="1" />
                      )}
                      {/* CSF */}
                      {classes[4].visible && (
                        <ellipse cx="100" cy="105" rx="18" ry="25" fill="rgba(52,211,153,0.35)" stroke="#34D399" strokeWidth="1" />
                      )}
                      {/* Edema */}
                      {classes[1].visible && (
                        <circle cx="78" cy="92" r="14" fill="rgba(245,158,11,0.3)" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
                      )}
                      {/* Tumor */}
                      {classes[0].visible && (
                        <circle cx="78" cy="92" r="7" fill="rgba(239,68,68,0.5)" stroke="#EF4444" strokeWidth="1.5" />
                      )}
                      {/* Spinal Disc (if spine) */}
                      {classes[5].visible && (
                        <rect x="85" y="155" width="30" height="6" rx="3" fill="rgba(167,139,250,0.3)" stroke="#A78BFA" strokeWidth="0.8" />
                      )}
                    </g>
                  )}

                  {/* Grid overlay */}
                  {done && (
                    <g opacity="0.06" stroke="#22D3EE" strokeWidth="0.3">
                      {[...Array(10)].map((_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} />
                      ))}
                      {[...Array(10)].map((_, i) => (
                        <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" />
                      ))}
                    </g>
                  )}
                </svg>

                {/* Scanning effect */}
                {processing && (
                  <motion.div
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]"
                  />
                )}

                {done && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <Badge variant="warning">
                      <Layers size={10} className="mr-1" /> 6 classes
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500">512×512 px</span>
                  </div>
                )}
              </div>

              {/* Opacity slider */}
              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center gap-3"
                >
                  <span className="text-xs text-slate-400 shrink-0">Mask Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none bg-white/[0.06] accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-cyan-300 w-10">
                    {Math.round(opacity * 100)}%
                  </span>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls + Confidence Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Segmentation Controls</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Toggle classes and view confidence
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Confidence gauge */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                {done ? (
                  <ConfidenceGauge value={0.912} />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <Gauge size={40} className="text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500">Run segmentation to view confidence</p>
                  </div>
                )}
              </div>

              {/* Color legend */}
              <div>
                <p className="text-sm font-medium text-slate-200 mb-2">Color Legend</p>
                <div className="space-y-1.5">
                  {classes.map((cls) => (
                    <button
                      key={cls.name}
                      onClick={() => toggleClass(cls.name)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg border p-2.5 transition-all",
                        cls.visible
                          ? "border-white/10 bg-white/[0.03]"
                          : "border-white/[0.04] bg-transparent opacity-50"
                      )}
                    >
                      <div
                        className="h-4 w-4 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: cls.color }}
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">{cls.name}</p>
                        <p className="text-xs text-slate-500">{cls.coverage}% coverage</p>
                      </div>
                      {cls.visible ? (
                        <Eye size={16} className="text-slate-400" />
                      ) : (
                        <EyeOff size={16} className="text-slate-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <Button className="w-full" size="lg" onClick={handleProcess} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Segmenting...
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Run Segmentation
                    </>
                  )}
                </Button>
                <Button variant="secondary" className="w-full" disabled={!done}>
                  <Download size={14} /> Export Mask (NIfTI)
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target size={18} className="text-cyan-400" />
                Segmentation Metrics
              </CardTitle>
              <div className="flex items-center gap-3">
                {done && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Hausdorff Distance:</span>
                    <span className="font-mono font-semibold text-amber-300">
                      {segmentationMetrics.hausdorff} mm
                    </span>
                  </div>
                )}
                {done ? (
                  <Badge variant="success">Computed</Badge>
                ) : (
                  <Badge variant="neutral">Awaiting processing</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metricsList.map((m) => (
                <div
                  key={m.key}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    done
                      ? "border-white/[0.08] bg-white/[0.03]"
                      : "border-white/[0.04] bg-white/[0.01] opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm font-display font-bold", m.color)}>
                      {m.label}
                    </span>
                    {done && <CheckCircle2 size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-2xl font-mono font-bold text-white">
                    {done ? segmentationMetrics[m.key as keyof typeof segmentationMetrics] : "—"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Model Architecture — MD-UNet-Seg</CardTitle>
              <Badge variant="blue">v2.8.0</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { stage: "Encoder", desc: "4 down-sampling blocks with residual connections", icon: Grid3x3 },
                { stage: "Bottleneck", desc: "Dilated atrous convolutions for multi-scale context", icon: Layers },
                { stage: "Attention Gates", desc: "Spatial attention suppresses irrelevant activations", icon: Brain },
                { stage: "Decoder", desc: "4 up-sampling blocks with skip connections", icon: Scissors },
              ].map((s, i) => (
                <div key={s.stage} className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xs font-bold text-white/20">0{i + 1}</span>
                    <s.icon size={16} className="text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{s.stage}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
