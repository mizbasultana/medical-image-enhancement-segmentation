import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Brain,
  Activity,
  Sparkles,
  Scissors,
  Target,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { recentScans, enhancementMetrics, segmentationMetrics } from "@/data/mock";
import { cn } from "@/lib/utils";

const statusConfig = {
  completed: { label: "Signed Off", variant: "success" as const, icon: CheckCircle2 },
  processing: { label: "In Review", variant: "blue" as const, icon: Clock },
  queued: { label: "Draft", variant: "neutral" as const, icon: Clock },
  failed: { label: "Flagged", variant: "danger" as const, icon: AlertCircle },
};

type RiskLevel = "Low" | "Medium" | "High";

function getRiskLevel(confidence: number): RiskLevel {
  if (confidence >= 95) return "Low";
  if (confidence >= 85) return "Medium";
  return "High";
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; border: string; icon: typeof ShieldCheck }> = {
  Low: { color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20", icon: ShieldCheck },
  Medium: { color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20", icon: AlertTriangle },
  High: { color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: AlertCircle },
};

function ReportDetail({ scan, onClose }: { scan: typeof recentScans[0]; onClose: () => void }) {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const risk = getRiskLevel(scan.confidence);
  const RiskIcon = riskConfig[risk].icon;

  const handlePrint = () => {
    window.print();
    toast({ type: "success", title: "Print dialog opened", description: `Report ${scan.id} sent to printer` });
  };

  const handleExport = () => {
    toast({ type: "success", title: "PDF Exported", description: `Report ${scan.id}.pdf downloaded successfully` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Report header with actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronDown size={16} /> Back to list
          </Button>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Clinical Report</h2>
            <p className="text-sm text-muted-foreground">{scan.id} · Generated {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer size={14} /> Print
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download size={14} /> Export PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        {/* Hospital letterhead */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 glow-cyan">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">MedhaDrishti AI</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Radiology Platform · NABH Accredited</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{scan.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(scan.uploadedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {[
              { label: "Patient Name", value: scan.patientName, icon: User },
              { label: "Patient ID", value: scan.patientId, icon: FileText },
              { label: "MRI Modality", value: scan.modality, icon: Activity },
              { label: "Scan Region", value: scan.region, icon: Brain },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <item.icon size={12} />
                  {item.label}
                </div>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* MRI Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} className="text-cyan-400" />
              MRI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Scan Dimensions", value: "512 × 512 × 128" },
                { label: "Voxel Size", value: "1.0 × 1.0 × 1.0 mm" },
                { label: "Slice Count", value: "128 slices" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-sm font-mono font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {scan.modality} acquisition of the {scan.region.toLowerCase()} region was performed with
                standard clinical protocol. The scan was processed through the MedhaDrishti AI pipeline
                including enhancement, segmentation, and explainability analysis. Key findings are
                summarized below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-400" />
              Enhancement Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "PSNR", value: `${enhancementMetrics.psnr} dB` },
                { label: "SSIM", value: enhancementMetrics.ssim.toFixed(3) },
                { label: "MSE", value: enhancementMetrics.mse.toFixed(4) },
                { label: "FSIM", value: enhancementMetrics.fsim.toFixed(3) },
                { label: "VIF", value: enhancementMetrics.vif.toFixed(3) },
                { label: "Entropy", value: `${enhancementMetrics.entropy} bits` },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-lg font-mono font-bold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Segmentation Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors size={18} className="text-cyan-400" />
              Segmentation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Dice Score", value: segmentationMetrics.dice.toFixed(3) },
                { label: "Jaccard (IoU)", value: segmentationMetrics.jaccard.toFixed(3) },
                { label: "Precision", value: segmentationMetrics.precision.toFixed(3) },
                { label: "Sensitivity", value: segmentationMetrics.sensitivity.toFixed(3) },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-lg font-mono font-bold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prediction Confidence + Risk Indicator */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={18} className="text-cyan-400" />
                Prediction Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="url(#conf-grad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42 * (scan.confidence / 100)} ${2 * Math.PI * 42}`}
                    />
                    <defs>
                      <linearGradient id="conf-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-xl font-mono font-bold text-foreground">{scan.confidence}%</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-1">Model Confidence</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The AI model predicts with {scan.confidence}% confidence based on
                    enhancement and segmentation analysis of the {scan.region.toLowerCase()} scan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-400" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("rounded-xl border p-5", riskConfig[risk].bg, riskConfig[risk].border)}>
                <div className="flex items-center gap-3 mb-3">
                  <RiskIcon className={riskConfig[risk].color} size={28} />
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className={cn("text-2xl font-display font-bold", riskConfig[risk].color)}>{risk}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {risk === "Low" && "Findings are within normal parameters. Routine follow-up recommended."}
                  {risk === "Medium" && "Some findings require attention. Recommend specialist consultation within 2 weeks."}
                  {risk === "High" && "Significant findings detected. Urgent specialist review recommended within 48 hours."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope size={18} className="text-cyan-400" />
              Clinical Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {scan.findings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 mt-0.5">
                    <span className="text-xs font-mono font-semibold text-cyan-400">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{finding}</p>
                </li>
              ))}
              <li className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5">
                <TrendingUp size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  Recommend follow-up scan in 6 months to monitor for progression. Correlate with
                  clinical symptoms and patient history for comprehensive assessment.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Doctor Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope size={18} className="text-cyan-400" />
              Doctor's Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                  AI
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dr. Arjun Iyer</p>
                  <p className="text-[10px] text-muted-foreground">Senior Radiologist · MCI-2018-45291</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mt-2">
                The AI-assisted analysis shows {scan.findings.length} key finding(s). The enhancement
                quality is excellent (SSIM: {enhancementMetrics.ssim.toFixed(3)}) with good segmentation
                overlap (Dice: {segmentationMetrics.dice.toFixed(3)}). Grad-CAM heatmap confirms the
                model's attention is focused on clinically relevant regions. Recommend correlation with
                patient symptoms and prior imaging studies.
              </p>
            </div>
            <textarea
              className="no-print w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/40 focus:outline-none resize-none"
              rows={3}
              placeholder="Add additional clinical notes..."
            />
            <div className="no-print flex justify-end">
              <Button size="sm">
                <CheckCircle2 size={14} /> Sign Off Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Signature line */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-xs text-muted-foreground mb-8">Digitally signed by</p>
            <p className="text-sm font-semibold text-foreground">Dr. Arjun Iyer</p>
            <p className="text-xs text-muted-foreground">Senior Radiologist · MCI-2018-45291</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-8">Report generated on</p>
            <p className="text-sm font-semibold text-foreground">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <p className="text-xs text-muted-foreground">MedhaDrishti AI Platform v1.0</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Reports() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedScan, setSelectedScan] = useState<typeof recentScans[0] | null>(null);

  const filtered = useMemo(() => {
    return recentScans.filter((s) => {
      const matchSearch =
        s.patientName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || s.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  if (selectedScan) {
    return <ReportDetail scan={selectedScan} onClose={() => setSelectedScan(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or scan ID..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-muted-foreground shrink-0" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 sm:flex-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground backdrop-blur-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer"
              >
                <option value="all">All Reports</option>
                <option value="completed">Signed Off</option>
                <option value="processing">In Review</option>
                <option value="queued">Draft</option>
                <option value="failed">Flagged</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Reports list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clinical Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{filtered.length} reports · sorted by most recent</p>
              </div>
              <Button variant="secondary" size="sm">
                <Printer size={14} /> Batch Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((scan, i) => {
                const status = statusConfig[scan.status];
                const risk = getRiskLevel(scan.confidence);
                return (
                  <motion.div
                    key={scan.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => scan.status === "completed" && setSelectedScan(scan)}
                    className={cn(
                      "group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all",
                      scan.status === "completed" && "cursor-pointer hover:border-cyan-500/20 hover:bg-white/[0.04] glow-hover"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/5 border border-cyan-500/15">
                        <FileText className="text-cyan-400" size={20} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-medium text-cyan-300">{scan.id}</span>
                        <Badge variant={status.variant}>
                          <status.icon size={10} className="mr-1" />
                          {status.label}
                        </Badge>
                        {scan.confidence > 0 && (
                          <Badge variant={risk === "Low" ? "success" : risk === "Medium" ? "warning" : "danger"}>
                            {risk} Risk
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {scan.patientName} <span className="text-xs text-muted-foreground font-normal">({scan.patientId})</span>
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{scan.modality}</span>
                        <span>·</span>
                        <span>{scan.region}</span>
                        <span>·</span>
                        <span>{new Date(scan.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="hidden lg:block max-w-xs">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {scan.findings.join(" · ")}
                      </p>
                    </div>
                    {scan.confidence > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="text-sm font-mono font-semibold text-emerald-300">{scan.confidence}%</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {scan.status === "completed" && (
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedScan(scan); }}>
                          <Eye size={16} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Download size={16} />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <EmptyState
                icon={<FileText size={32} className="text-muted-foreground" />}
                title="No reports found"
                description="No reports match your search criteria. Try adjusting your filters or search query."
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Reports Generated", value: "48,290", icon: FileText, color: "text-cyan-400" },
          { label: "Pending Review", value: "1,847", icon: Clock, color: "text-amber-400" },
          { label: "Signed Off", value: "46,443", icon: CheckCircle2, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}>
            <Card className="p-5 flex items-center gap-4 glow-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10">
                <stat.icon className={stat.color} size={22} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
