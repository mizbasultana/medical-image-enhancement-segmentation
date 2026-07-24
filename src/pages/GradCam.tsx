import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Eye,
  Play,
  Download,
  Thermometer,
  Loader2,
  CheckCircle2,
  Flame,
  Layers,
  Target,
  Brain,
  Sparkles,
  Scissors,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const layers = ["conv5_3", "conv4_3", "conv3_3", "transformer_block_6"];
const targetClasses = ["Normal", "Lesion", "Atrophy", "Edema"];

const hotspots = [
  { id: "hs1", cx: 40, cy: 46, r: 18, label: "Left Temporal Region", explanation: "High attention detected in the left temporal lobe, suggesting potential abnormality in this region. The model identified distinctive texture and intensity patterns consistent with tissue changes.", confidence: 0.87 },
  { id: "hs2", cx: 58, cy: 50, r: 14, label: "Parietal Cortex", explanation: "Moderate activation in the parietal cortex. This area shows subtle intensity variations that the model considers relevant for the prediction.", confidence: 0.64 },
  { id: "hs3", cx: 50, cy: 65, r: 12, label: "Posterior Ventricle", explanation: "Low-level attention in the posterior ventricular region. Ventricular size appears within normal limits based on this activation pattern.", confidence: 0.41 },
];

const confidenceData = [
  { slice: 1, confidence: 0.42 },
  { slice: 10, confidence: 0.55 },
  { slice: 20, confidence: 0.68 },
  { slice: 30, confidence: 0.74 },
  { slice: 40, confidence: 0.81 },
  { slice: 50, confidence: 0.87 },
  { slice: 60, confidence: 0.89 },
  { slice: 70, confidence: 0.86 },
  { slice: 80, confidence: 0.91 },
  { slice: 90, confidence: 0.88 },
  { slice: 100, confidence: 0.85 },
  { slice: 110, confidence: 0.82 },
  { slice: 120, confidence: 0.79 },
  { slice: 128, confidence: 0.76 },
];

const tooltipStyle = {
  backgroundColor: "#0E1626",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "12px",
};

type ViewMode = "original" | "enhanced" | "gradcam" | "segmentation";

const viewModes: { key: ViewMode; label: string; icon: typeof Eye }[] = [
  { key: "original", label: "Original", icon: ImageIcon },
  { key: "enhanced", label: "Enhanced", icon: Sparkles },
  { key: "gradcam", label: "GradCAM", icon: Eye },
  { key: "segmentation", label: "Segmentation", icon: Scissors },
];

function BrainSVG({ variant }: { variant: ViewMode }) {
  const isEnhanced = variant === "enhanced" || variant === "gradcam" || variant === "segmentation";
  const bg = isEnhanced
    ? "radial-gradient(circle at 50% 45%, rgba(34,211,238,0.3), rgba(11,18,32,0.9) 75%)"
    : "radial-gradient(circle at 50% 45%, rgba(100,130,180,0.2), rgba(11,18,32,0.95) 75%)";

  return (
    <div className="absolute inset-0" style={{ background: bg, filter: isEnhanced ? "contrast(1.1) brightness(1.05)" : "blur(1px) contrast(0.8)" }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ opacity: isEnhanced ? 0.85 : 0.5 }}>
        <path d="M100 45 C 60 45, 45 80, 50 115 C 53 140, 70 158, 95 162 L 95 100 Z" fill={isEnhanced ? "rgba(34,211,238,0.25)" : "rgba(120,150,200,0.15)"} stroke={isEnhanced ? "rgba(34,211,238,0.3)" : "rgba(120,150,200,0.2)"} strokeWidth="0.5" />
        <path d="M100 45 C 140 45, 155 80, 150 115 C 147 140, 130 158, 105 162 L 105 100 Z" fill={isEnhanced ? "rgba(34,211,238,0.25)" : "rgba(120,150,200,0.15)"} stroke={isEnhanced ? "rgba(34,211,238,0.3)" : "rgba(120,150,200,0.2)"} strokeWidth="0.5" />
        <path d="M100 50 L 100 155" stroke={isEnhanced ? "rgba(34,211,238,0.3)" : "rgba(180,200,220,0.15)"} strokeWidth="0.5" />
        {isEnhanced && (
          <>
            <path d="M70 75 C 80 85, 80 105, 75 125" stroke="rgba(59,130,246,0.25)" strokeWidth="1" fill="none" />
            <path d="M130 75 C 120 85, 120 105, 125 125" stroke="rgba(59,130,246,0.25)" strokeWidth="1" fill="none" />
          </>
        )}
      </svg>
      {/* Segmentation overlay */}
      {variant === "segmentation" && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }}>
          <path d="M100 50 C 70 50, 55 78, 58 108 C 60 125, 72 140, 90 145 L 90 95 Z" fill="rgba(34,211,238,0.3)" stroke="#22D3EE" strokeWidth="1" />
          <path d="M100 50 C 130 50, 145 78, 142 108 C 140 125, 128 140, 110 145 L 110 95 Z" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth="1" />
          <ellipse cx="100" cy="105" rx="18" ry="25" fill="rgba(52,211,153,0.3)" stroke="#34D399" strokeWidth="1" />
          <circle cx="78" cy="92" r="10" fill="rgba(245,158,11,0.4)" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      )}
      {/* GradCAM heatmap */}
      {variant === "gradcam" && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="hs1" cx="40%" cy="46%" r="20%">
              <stop stopColor="#FF0000" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#FF6600" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hs2" cx="58%" cy="50%" r="15%">
              <stop stopColor="#FFAA00" stopOpacity="0.6" />
              <stop offset="0.6" stopColor="#FFFF00" stopOpacity="0.3" />
              <stop offset="1" stopColor="#FFAA00" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hs3" cx="50%" cy="65%" r="12%">
              <stop stopColor="#00FF00" stopOpacity="0.4" />
              <stop offset="1" stopColor="#00FF00" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#hs1)" />
          <rect width="200" height="200" fill="url(#hs2)" />
          <rect width="200" height="200" fill="url(#hs3)" />
        </svg>
      )}
    </div>
  );
}

export function GradCam() {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState("conv5_3");
  const [targetClass, setTargetClass] = useState("Lesion");
  const [opacity, setOpacity] = useState(0.6);
  const [viewMode, setViewMode] = useState<ViewMode>("gradcam");
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

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
        return p + Math.random() * 15;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Grad-CAM viewer */}
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
                  <CardTitle>Grad-CAM Explainability</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gradient-weighted Class Activation Map overlay
                  </p>
                </div>
                {done && (
                  <Badge variant="success">
                    <CheckCircle2 size={12} className="mr-1" /> Confidence 0.89
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* View mode tabs */}
              <div className="flex flex-wrap gap-1.5 mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                {viewModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all flex-1 justify-center",
                      viewMode === mode.key
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    )}
                  >
                    <mode.icon size={14} />
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden border border-white/[0.06] bg-navy-900">
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/80 backdrop-blur-sm z-10">
                    <Loader2 className="text-cyan-400 animate-spin" size={28} />
                    <p className="text-sm text-slate-300">Computing gradients...</p>
                    <Progress value={progress} className="w-2/3" />
                    <p className="text-xs font-mono text-cyan-300">
                      {Math.round(Math.min(100, progress))}%
                    </p>
                  </div>
                )}

                <BrainSVG variant={viewMode} />

                {/* Interactive hotspots for GradCAM mode */}
                {viewMode === "gradcam" && done && (
                  <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                    {hotspots.map((hs) => (
                      <circle
                        key={hs.id}
                        cx={hs.cx}
                        cy={hs.cy}
                        r={hoveredHotspot === hs.id ? hs.r + 4 : hs.r}
                        fill="transparent"
                        stroke={hoveredHotspot === hs.id ? "#22D3EE" : "rgba(34,211,238,0.4)"}
                        strokeWidth={hoveredHotspot === hs.id ? 2 : 1}
                        strokeDasharray="3 3"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredHotspot(hs.id)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                      />
                    ))}
                  </svg>
                )}

                {/* Hover explanation tooltip */}
                <AnimatePresence>
                  {viewMode === "gradcam" && done && hoveredHotspot && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-3 left-3 right-3 glass-strong rounded-xl border border-cyan-500/20 p-3 z-20"
                    >
                      {(() => {
                        const hs = hotspots.find((h) => h.id === hoveredHotspot)!;
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <Info size={12} className="text-cyan-400" />
                              <p className="text-xs font-semibold text-cyan-300">{hs.label}</p>
                              <Badge variant="default" className="ml-auto">{(hs.confidence * 100).toFixed(0)}% attention</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{hs.explanation}</p>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Heatmap opacity overlay for gradcam mode */}
                {viewMode === "gradcam" && done && (
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity }} />
                )}

                {/* Color bar legend */}
                {viewMode === "gradcam" && done && (
                  <div className="absolute right-2 top-2 bottom-2 w-2 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-t from-blue-600 via-green-500 via-yellow-400 via-orange-500 to-red-500" />
                  </div>
                )}

                {viewMode === "gradcam" && done && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <Badge variant="warning">
                      <Thermometer size={10} className="mr-1" /> Layer: {selectedLayer}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Opacity slider */}
              {viewMode === "gradcam" && done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center gap-3"
                >
                  <span className="text-xs text-slate-400 shrink-0">Overlay Opacity</span>
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

              {/* Top contributing regions */}
              {viewMode === "gradcam" && done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  <p className="text-xs font-medium text-slate-400 mb-2">
                    Top Contributing Regions (Attention Map)
                  </p>
                  {[
                    { region: "Left Parietal Cortex", activation: 0.87 },
                    { region: "Posterior Ventricle", activation: 0.64 },
                    { region: "Frontal White Matter", activation: 0.41 },
                  ].map((r) => (
                    <div key={r.region} className="flex items-center gap-3">
                      <span className="text-xs text-slate-300 w-40">{r.region}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500"
                          style={{ width: `${r.activation * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-amber-300 w-10">
                        {r.activation.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls + Prediction Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Grad-CAM Parameters</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure explainability map generation
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200">Target Layer</p>
                <div className="space-y-1.5">
                  {layers.map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setSelectedLayer(layer)}
                      className={cn(
                        "w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                        selectedLayer === layer
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      <Layers size={14} />
                      {layer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200">Target Class</p>
                <div className="grid grid-cols-2 gap-2">
                  {targetClasses.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setTargetClass(cls)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        targetClass === cls
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      <Target size={12} />
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Confidence */}
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-emerald-300">AI Confidence</span>
                    <span className="text-lg font-mono font-bold text-emerald-300">89%</span>
                  </div>
                  <Progress value={89} indicatorClassName="bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <p className="text-[10px] text-slate-500 mt-2">
                    Predicted class: <span className="text-emerald-300 font-medium">{targetClass}</span>
                  </p>
                </motion.div>
              )}

              {/* Prediction Explanation */}
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-cyan-400" />
                    <p className="text-xs font-medium text-cyan-300">Prediction Explanation</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The model focused {Math.round(opacity * 100)}% attention on the left
                    parietal cortex region, consistent with the predicted class{" "}
                    <span className="text-cyan-300 font-medium">{targetClass}</span>. Secondary
                    activation in the posterior ventricle suggests structural involvement.
                    No significant attention on contralateral regions.
                  </p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleProcess} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Computing...
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Generate Grad-CAM
                    </>
                  )}
                </Button>
                <Button variant="secondary" className="w-full" disabled={!done}>
                  <Download size={14} /> Export Heatmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confidence Graph */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={18} className="text-cyan-400" />
                    Slice-wise Confidence Distribution
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Model confidence across 128 MRI slices — hover hotspots above for region explanations
                  </p>
                </div>
                <Badge variant="success">Avg 0.79</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={confidenceData}>
                  <defs>
                    <linearGradient id="conf-slice-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="slice" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} label={{ value: "Slice #", position: "insideBottom", offset: -5, style: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 1]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="confidence" stroke="#22D3EE" strokeWidth={2.5} fill="url(#conf-slice-grad)" dot={{ fill: "#22D3EE", r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 4-way Comparison View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Flame size={18} className="text-cyan-400" />
                  Comparison View
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Side-by-side comparison across all pipeline stages
                </p>
              </div>
              {done && <Badge variant="success">Pipeline complete</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {viewModes.map((mode) => (
                <motion.div
                  key={mode.key}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                  onClick={() => setViewMode(mode.key)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] bg-navy-900 transition-all group-hover:border-cyan-500/30">
                    <BrainSVG variant={mode.key} />
                    {/* Color bar for gradcam */}
                    {mode.key === "gradcam" && done && (
                      <div className="absolute right-1 top-1 bottom-1 w-1 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-t from-blue-600 via-green-500 via-yellow-400 to-red-500" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          mode.key === "original" ? "neutral" :
                          mode.key === "enhanced" ? "default" :
                          mode.key === "gradcam" ? "warning" : "blue"
                        }
                      >
                        <mode.icon size={10} className="mr-1" />
                        {mode.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-center text-slate-500">
                    {mode.key === "original" && "Raw acquisition"}
                    {mode.key === "enhanced" && "ViT + CLAHE processed"}
                    {mode.key === "gradcam" && "Explainability heatmap"}
                    {mode.key === "segmentation" && "UNet ROI masks"}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
