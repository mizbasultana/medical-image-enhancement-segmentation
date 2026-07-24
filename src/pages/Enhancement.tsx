import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  Download,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Sun,
  Contrast,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Gauge,
  Waves,
  Focus,
  ScanLine,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { enhancementMetrics } from "@/data/mock";

const totalSlices = 128;

const metricsList = [
  { key: "psnr", label: "PSNR", desc: "Peak Signal-to-Noise Ratio", unit: "dB", color: "text-cyan-400" },
  { key: "ssim", label: "SSIM", desc: "Structural Similarity Index", unit: "", color: "text-blue-400" },
  { key: "mse", label: "MSE", desc: "Mean Squared Error", unit: "", color: "text-amber-400" },
  { key: "rmse", label: "RMSE", desc: "Root Mean Squared Error", unit: "", color: "text-rose-400" },
  { key: "entropy", label: "Entropy", desc: "Information Entropy", unit: "bits", color: "text-violet-400" },
  { key: "fsim", label: "FSIM", desc: "Feature Similarity Index", unit: "", color: "text-emerald-400" },
  { key: "vif", label: "VIF", desc: "Visual Information Fidelity", unit: "", color: "text-teal-400" },
  { key: "niqe", label: "NIQE", desc: "Natural Image Quality Evaluator", unit: "", color: "text-sky-400" },
  { key: "piqe", label: "PIQE", desc: "Perception-based Image Quality Evaluator", unit: "", color: "text-indigo-400" },
];

const timelineSteps = [
  { label: "Loading", icon: ScanLine, duration: 0.8 },
  { label: "Denoising", icon: Waves, duration: 1.2 },
  { label: "CLAHE", icon: Contrast, duration: 1.0 },
  { label: "Super-Res", icon: Sparkles, duration: 1.5 },
  { label: "Sharpening", icon: Focus, duration: 0.8 },
  { label: "Complete", icon: CheckCircle2, duration: 0.6 },
];

export function Enhancement() {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  const [sliderPos, setSliderPos] = useState(50);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [slice, setSlice] = useState(64);
  const [isDragging, setIsDragging] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleProcess = () => {
    setProcessing(true);
    setDone(false);
    setProgress(0);
    setActiveStep(0);
    let step = 0;
    let stepProgress = 0;
    const interval = setInterval(() => {
      stepProgress += Math.random() * 18;
      if (stepProgress >= 100) {
        stepProgress = 0;
        step += 1;
        if (step >= timelineSteps.length) {
          clearInterval(interval);
          setProcessing(false);
          setDone(true);
          setActiveStep(-1);
          setProgress(100);
          return;
        }
        setActiveStep(step);
      }
      const overall = ((step + stepProgress / 100) / timelineSteps.length) * 100;
      setProgress(overall);
    }, 120);
  };

  const handleReset = () => {
    setDone(false);
    setProgress(0);
    setBrightness(1);
    setContrast(1);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSliderPos(50);
    setSlice(64);
  };

  const handleSliderMove = useCallback((clientX: number) => {
    if (!viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const handlePanMove = useCallback((clientX: number, clientY: number) => {
    if (!viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 100;
    setPan({ x: x * (zoom - 1), y: y * (zoom - 1) });
  }, [zoom]);

  const imageFilter = `brightness(${brightness}) contrast(${contrast})`;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Before/After Slider Viewer */}
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
                  <CardTitle>Enhancement Viewer</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag the slider to compare original vs. enhanced
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {done && (
                    <Badge variant="success">
                      <CheckCircle2 size={12} className="mr-1" /> Enhanced
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFullscreen(!fullscreen)}
                    title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Viewer */}
              <div
                ref={viewerRef}
                className={cn(
                  "relative rounded-xl overflow-hidden border border-white/[0.06] bg-navy-900 select-none",
                  fullscreen ? "fixed inset-4 z-50" : "aspect-square max-w-lg mx-auto"
                )}
              >
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/80 backdrop-blur-sm z-20">
                    <Loader2 className="text-cyan-400 animate-spin" size={32} />
                    <p className="text-sm text-slate-300">
                      {activeStep >= 0 && activeStep < timelineSteps.length
                        ? `${timelineSteps[activeStep].label}...`
                        : "Processing..."}
                    </p>
                    <Progress value={progress} className="w-2/3" />
                    <p className="text-xs font-mono text-cyan-300">
                      {Math.round(Math.min(100, progress))}%
                    </p>
                  </div>
                )}

                {/* Original (left side) */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform"
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x}%, ${pan.y}%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 45%, rgba(120,140,180,0.25), rgba(11,18,32,0.95) 75%)",
                        filter: `blur(2px) ${imageFilter}`,
                      }}
                    />
                    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-60">
                      <path d="M100 50 C 65 50, 50 80, 55 110 C 58 130, 70 150, 90 155 L 90 100 Z" fill="rgba(150,170,200,0.3)" />
                      <path d="M100 50 C 135 50, 150 80, 145 110 C 142 130, 130 150, 110 155 L 110 100 Z" fill="rgba(150,170,200,0.3)" />
                      <path d="M100 55 L 100 150" stroke="rgba(180,200,220,0.2)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Enhanced (right side, clipped by slider) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                  <div
                    className="absolute inset-0 transition-transform"
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x}%, ${pan.y}%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 45%, rgba(34,211,238,0.35), rgba(11,18,32,0.9) 75%)",
                        filter: done
                          ? `contrast(${1.2}) brightness(1.1) ${imageFilter}`
                          : "contrast(0.7) brightness(0.8) blur(2px)",
                      }}
                    />
                    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ opacity: done ? 0.85 : 0.4 }}>
                      <path d="M100 50 C 65 50, 50 80, 55 110 C 58 130, 70 150, 90 155 L 90 100 Z" fill="rgba(34,211,238,0.35)" />
                      <path d="M100 50 C 135 50, 150 80, 145 110 C 142 130, 130 150, 110 155 L 110 100 Z" fill="rgba(34,211,238,0.35)" />
                      <path d="M100 55 L 100 150" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
                      <path d="M70 75 C 80 85, 80 105, 75 125" stroke="rgba(59,130,246,0.3)" strokeWidth="1" fill="none" />
                      <path d="M130 75 C 120 85, 120 105, 125 125" stroke="rgba(59,130,246,0.3)" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10 cursor-ew-resize shadow-[0_0_12px_2px_rgba(34,211,238,0.5)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 border-2 border-cyan-400 shadow-lg">
                    <Move size={16} className="text-cyan-400" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="neutral">Original</Badge>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="default">
                    <Sparkles size={10} className="mr-1" /> Enhanced
                  </Badge>
                </div>

                {/* Slice navigation */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  <button
                    onClick={() => setSlice((s) => Math.max(1, s - 1))}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono text-slate-300">
                    Slice {slice} / {totalSlices}
                  </span>
                  <button
                    onClick={() => setSlice((s) => Math.min(totalSlices, s + 1))}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Mouse handlers for slider */}
                <div
                  className="absolute top-0 bottom-0 z-10"
                  style={{ left: `${sliderPos}%`, width: "20px", marginLeft: "-10px", cursor: "ew-resize" }}
                  onMouseDown={(e) => {
                    setIsDragging(true);
                    handleSliderMove(e.clientX);
                  }}
                />
                <div
                  className="absolute inset-0 z-0"
                  onMouseDown={(e) => {
                    if (e.button === 1 || e.shiftKey) {
                      setIsDragging(true);
                      handlePanMove(e.clientX, e.clientY);
                    } else {
                      setIsDragging(true);
                      handleSliderMove(e.clientX);
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isDragging) {
                      if (e.shiftKey) handlePanMove(e.clientX, e.clientY);
                      else handleSliderMove(e.clientX);
                    }
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                />
              </div>

              {/* Viewer controls */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setZoom((z) => Math.max(1, z - 0.2))}>
                  <ZoomOut size={14} /> Zoom Out
                </Button>
                <span className="text-xs font-mono text-slate-400 w-12 text-center">
                  {zoom.toFixed(1)}x
                </span>
                <Button variant="secondary" size="sm" onClick={() => setZoom((z) => Math.min(4, z + 0.2))}>
                  <ZoomIn size={14} /> Zoom In
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button variant="secondary" size="sm" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
                  <Move size={14} /> Reset View
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <span className="text-xs text-slate-500">Shift+Drag to pan</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Adjustments</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Brightness, contrast, and processing controls
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Brightness", icon: Sun, value: brightness, set: setBrightness, min: 0.5, max: 2, step: 0.05, unit: "x" },
                { label: "Contrast", icon: Contrast, value: contrast, set: setContrast, min: 0.5, max: 2, step: 0.05, unit: "x" },
              ].map((param) => (
                <div key={param.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <param.icon size={14} className="text-slate-500" />
                      {param.label}
                    </Label>
                    <span className="text-xs font-mono text-cyan-300">
                      {param.value.toFixed(2)}{param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => param.set(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/[0.06] accent-cyan-500 cursor-pointer"
                  />
                </div>
              ))}

              {/* Slice navigation slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <ScanLine size={14} className="text-slate-500" />
                    Slice Navigation
                  </Label>
                  <span className="text-xs font-mono text-cyan-300">
                    {slice} / {totalSlices}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={totalSlices}
                  step={1}
                  value={slice}
                  onChange={(e) => setSlice(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-white/[0.06] accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 space-y-2">
                <Button className="w-full" size="lg" onClick={handleProcess} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Run Enhancement
                    </>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={handleReset}>
                    <RotateCcw size={14} /> Reset
                  </Button>
                  <Button variant="secondary" className="flex-1" disabled={!done}>
                    <Download size={14} /> Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Processing Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              Processing Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time pipeline stage tracking
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {timelineSteps.map((step, i) => {
                const isComplete = done || (processing && i < activeStep);
                const isActive = processing && i === activeStep;
                return (
                  <div key={step.label} className="flex items-center shrink-0">
                    <div
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-4 py-3 transition-all min-w-[100px]",
                        isComplete
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : isActive
                          ? "border-cyan-500/40 bg-cyan-500/10"
                          : "border-white/[0.06] bg-white/[0.02]"
                      )}
                    >
                      {isActive ? (
                        <Loader2 size={18} className="text-cyan-400 animate-spin" />
                      ) : isComplete ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <step.icon size={18} className="text-slate-600" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isComplete ? "text-emerald-300" : isActive ? "text-cyan-300" : "text-slate-500"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className={cn("h-px w-6 mx-0.5", isComplete ? "bg-emerald-500/40" : "bg-white/10")} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gauge size={18} className="text-cyan-400" />
                Quality Metrics
              </CardTitle>
              {done ? (
                <Badge variant="success">Computed</Badge>
              ) : (
                <Badge variant="neutral">Awaiting processing</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
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
                    {done && (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    )}
                  </div>
                  <p className="text-2xl font-mono font-bold text-white">
                    {done ? enhancementMetrics[m.key as keyof typeof enhancementMetrics] : "—"}
                    {done && m.unit && <span className="text-sm text-slate-500 ml-1">{m.unit}</span>}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
