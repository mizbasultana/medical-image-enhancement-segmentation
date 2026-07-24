import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Zap,
  Users,
  TrendingUp,
  Cpu,
  Thermometer,
  Gauge,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload as UploadIcon,
  Sparkles,
  Scissors,
  Eye,
  FileText,
  ArrowUpRight,
  Target,
  ShieldCheck,
  AlertTriangle,
  Server,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  recentScans,
  activityFeed,
  models,
  gpuInfo,
  accuracyTrend,
  enhancementMetrics,
  segmentationMetrics,
} from "@/data/mock";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#0E1626",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "12px",
};

const quickStats = [
  { label: "Total Scans", value: 48290, suffix: "", change: "+12.4%", icon: Brain, color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/5" },
  { label: "Avg Accuracy", value: 96.4, decimals: 1, suffix: "%", change: "+2.1%", icon: Target, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/5" },
  { label: "Inference Time", value: 142, suffix: "ms", change: "-18ms", icon: Zap, color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/5" },
  { label: "Active Patients", value: 12847, suffix: "", change: "+847", icon: Users, color: "text-violet-400", bg: "from-violet-500/20 to-purple-500/5" },
];

const kpiStats = [
  { label: "Avg Dice Score", value: segmentationMetrics.dice, decimals: 3, suffix: "", change: "+0.02", icon: Scissors, color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/5" },
  { label: "Avg SSIM", value: enhancementMetrics.ssim, decimals: 3, suffix: "", change: "+0.03", icon: Sparkles, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/5" },
  { label: "Avg PSNR", value: enhancementMetrics.psnr, decimals: 1, suffix: " dB", change: "+1.2", icon: Activity, color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/5" },
  { label: "GPU Usage", value: gpuInfo.utilization, suffix: "%", change: "-5%", icon: Cpu, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/5" },
  { label: "Memory Usage", value: 67, suffix: "%", change: "-3%", icon: Gauge, color: "text-violet-400", bg: "from-violet-500/20 to-purple-500/5" },
];

const activityIcons = {
  upload: UploadIcon,
  enhancement: Sparkles,
  segmentation: Scissors,
  report: FileText,
  gradcam: Eye,
};

const statusConfig = {
  completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
  processing: { label: "Processing", variant: "blue" as const, icon: Clock },
  queued: { label: "Queued", variant: "neutral" as const, icon: Clock },
  failed: { label: "Failed", variant: "danger" as const, icon: AlertCircle },
};

const modelComparison = [
  { name: "UNet", accuracy: 91.2, latency: 112, params: "31M", color: "#3B82F6" },
  { name: "Attention UNet", accuracy: 94.2, latency: 98, params: "38M", color: "#22D3EE" },
  { name: "Vision Transformer", accuracy: 96.4, latency: 142, params: "86M", color: "#34D399" },
];

const comparisonChartData = modelComparison.map((m) => ({
  name: m.name,
  Accuracy: m.accuracy,
  Latency: m.latency,
}));

const riskScans = recentScans.filter((s) => s.confidence > 0).slice(0, 3);

const riskConfig = {
  Low: { color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20", icon: ShieldCheck },
  Medium: { color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20", icon: AlertTriangle },
  High: { color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: AlertCircle },
};

function getRisk(confidence: number): keyof typeof riskConfig {
  if (confidence >= 95) return "Low";
  if (confidence >= 85) return "Medium";
  return "High";
}

const systemServices = [
  { label: "GPU Cluster", icon: Cpu, status: "Operational", color: "text-emerald-400", value: "73%" },
  { label: "Inference Server", icon: Server, status: "Online", color: "text-emerald-400", value: "4 nodes" },
  { label: "API Gateway", icon: Wifi, status: "Responsive", color: "text-emerald-400", value: "52ms" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick stats with animated counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="p-5 glow-hover h-full">
              <div className="flex items-start justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br border border-white/10", stat.bg)}>
                  <stat.icon className={stat.color} size={20} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4 font-display text-2xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* KPI cards row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="p-4 glow-hover h-full">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border border-white/10 mb-3", stat.bg)}>
                <stat.icon className={stat.color} size={18} />
              </div>
              <div className="font-display text-xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accuracy chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Model Accuracy Trend</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Rolling 7-month accuracy across all models</p>
                </div>
                <Badge variant="success">+5.2% YoY</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={accuracyTrend}>
                  <defs>
                    <linearGradient id="acc-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[88, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="#22D3EE" strokeWidth={2.5} fill="url(#acc-grad)" dot={{ fill: "#22D3EE", r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Health Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Model Health</CardTitle>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Go
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemServices.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                    <s.icon className={s.color} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.status}</p>
                  </div>
                  <span className="text-xs font-mono text-cyan-300">{s.value}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              ))}

              <div className="pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Cpu className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{gpuInfo.name}</p>
                    <p className="text-xs text-muted-foreground">SXM4 · 80GB HBM2e</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-mono text-cyan-300">{gpuInfo.utilization}%</span>
                    </div>
                    <Progress value={gpuInfo.utilization} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Memory</span>
                      <span className="font-mono text-cyan-300">{gpuInfo.memoryUsed.toFixed(1)} / {gpuInfo.memoryTotal} GB</span>
                    </div>
                    <Progress value={(gpuInfo.memoryUsed / gpuInfo.memoryTotal) * 100} indicatorClassName="bg-gradient-to-r from-emerald-400 to-teal-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Thermometer size={12} /> Temp
                    </div>
                    <p className="text-sm font-mono font-semibold text-foreground">{gpuInfo.temperature}°C</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Gauge size={12} /> Power
                    </div>
                    <p className="text-sm font-mono font-semibold text-foreground">{gpuInfo.powerDraw}W</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Model Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Model Comparison</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Performance comparison across UNet, Attention UNet, and Vision Transformer</p>
              </div>
              <Badge variant="blue">3 models</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-4 mb-5">
              {modelComparison.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 glow-hover"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: model.color }} />
                      <span className="text-sm font-semibold text-foreground">{model.name}</span>
                    </div>
                    {model.accuracy === Math.max(...modelComparison.map((m) => m.accuracy)) && (
                      <Badge variant="success">Best</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Accuracy</p>
                      <p className="text-lg font-mono font-bold text-foreground">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Latency</p>
                      <p className="text-lg font-mono font-bold text-foreground">{model.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Params</p>
                      <p className="text-lg font-mono font-bold text-foreground">{model.params}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar yAxisId="left" dataKey="Accuracy" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="right" dataKey="Latency" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Indicator + Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-400" />
                Risk Assessment
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Recent scan risk classifications</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskScans.map((scan) => {
                const risk = getRisk(scan.confidence);
                const config = riskConfig[risk];
                return (
                  <div key={scan.id} className={cn("flex items-center gap-3 rounded-xl border p-3.5", config.bg, config.border)}>
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.bg, "border", config.border)}>
                      <config.icon className={config.color} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{scan.patientName}</p>
                      <p className="text-xs text-muted-foreground">{scan.id} · {scan.modality}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-bold", config.color)}>{risk}</p>
                      <p className="text-xs font-mono text-muted-foreground">{scan.confidence}%</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {activityFeed.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.03] transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/15">
                      <Icon className="text-cyan-400" size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{activity.timestamp}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{activity.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Latest MRI results table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest MRI Results</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Most recent scans processed through the pipeline</p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/reports">View all <ArrowUpRight size={14} /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    {["Scan ID", "Patient", "Modality", "Region", "Confidence", "Status"].map((h) => (
                      <th key={h} className="pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentScans.map((scan) => {
                    const status = statusConfig[scan.status];
                    return (
                      <tr key={scan.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-sm font-mono text-cyan-300">{scan.id}</td>
                        <td className="py-3">
                          <p className="text-sm font-medium text-foreground">{scan.patientName}</p>
                          <p className="text-xs text-muted-foreground">{scan.patientId}</p>
                        </td>
                        <td className="py-3 text-sm text-foreground">{scan.modality}</td>
                        <td className="py-3 text-sm text-foreground">{scan.region}</td>
                        <td className="py-3">
                          {scan.confidence > 0 ? (
                            <span className="text-sm font-mono font-semibold text-emerald-300">{scan.confidence}%</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge variant={status.variant}>
                            <status.icon size={12} className="mr-1" />
                            {status.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
