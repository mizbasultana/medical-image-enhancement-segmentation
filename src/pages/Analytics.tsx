import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Zap,
  Target,
  Brain,
  CheckCircle2,
  Cpu,
  HardDrive,
  MemoryStick,
  Database,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  accuracyTrend,
  inferenceTrend,
  modalityDistribution,
  regionDistribution,
  trainingHistory,
  resourceUsage,
  inferenceTimeData,
  datasetStats,
} from "@/data/mock";

const tooltipStyle = {
  backgroundColor: "#0E1626",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "12px",
};

const summaryCards = [
  { label: "Total Inferences", value: 48290, suffix: "", change: "+12.4%", icon: Activity, color: "text-cyan-400" },
  { label: "Avg Latency", value: 142, suffix: "ms", change: "-18ms", icon: Zap, color: "text-blue-400" },
  { label: "Model Accuracy", value: 96.4, suffix: "%", decimals: 1, change: "+2.1%", icon: Target, color: "text-emerald-400" },
  { label: "Success Rate", value: 99.2, suffix: "%", decimals: 1, change: "+0.3%", icon: CheckCircle2, color: "text-violet-400" },
];

const resourceCards = [
  { label: "GPU Usage", value: 73, icon: Cpu, color: "text-cyan-400", gradient: "from-cyan-400 to-blue-500" },
  { label: "CPU Usage", value: 51, icon: Activity, color: "text-blue-400", gradient: "from-blue-400 to-indigo-500" },
  { label: "Memory Usage", value: 67, icon: MemoryStick, color: "text-emerald-400", gradient: "from-emerald-400 to-teal-500" },
];

const radarData = [
  { metric: "Accuracy", value: 96 },
  { metric: "Speed", value: 88 },
  { metric: "Dice", value: 91 },
  { metric: "Robustness", value: 84 },
  { metric: "Explainability", value: 89 },
  { metric: "Generalization", value: 87 },
];

const splitData = [
  { name: "Train", value: 70, fill: "#22D3EE" },
  { name: "Validation", value: 15, fill: "#3B82F6" },
  { name: "Test", value: 15, fill: "#34D399" },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10">
                  <card.icon className={card.color} size={20} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <TrendingUp size={12} />
                  {card.change}
                </span>
              </div>
              <div className="mt-4 font-display text-2xl font-bold text-white">
                <AnimatedCounter value={card.value} suffix={card.suffix} decimals={card.decimals ?? 0} />
              </div>
              <div className="mt-1 text-xs text-slate-500">{card.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Training & Validation Loss */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Training & Validation Loss</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Loss curves across 18 epochs — convergence and overfitting detection
                </p>
              </div>
              <Badge variant="success">Converged at epoch 14</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} label={{ value: "Epoch", position: "insideBottom", offset: -5, style: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } }} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} label={{ value: "Loss", angle: -90, position: "insideLeft", style: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#22D3EE" strokeWidth={2.5} dot={{ fill: "#22D3EE", r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 3 }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Curve & Accuracy Curve */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Learning Curve</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Training vs. validation loss convergence over epochs
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trainingHistory}>
                  <defs>
                    <linearGradient id="train-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="val-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area type="monotone" dataKey="trainLoss" name="Train Loss" stroke="#22D3EE" strokeWidth={2} fill="url(#train-grad)" />
                  <Area type="monotone" dataKey="valLoss" name="Val Loss" stroke="#F59E0B" strokeWidth={2} fill="url(#val-grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Curve</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Validation accuracy improvement across training epochs
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trainingHistory}>
                  <defs>
                    <linearGradient id="acc-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="accuracy" name="Validation Accuracy %" stroke="#34D399" strokeWidth={2.5} fill="url(#acc-grad)" dot={{ fill: "#34D399", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resource Usage: GPU, CPU, Memory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Resource Usage</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  24-hour GPU, CPU, and memory utilization
                </p>
              </div>
              <Badge variant="blue">Live monitoring</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Resource cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {resourceCards.map((r) => (
                <div key={r.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <r.icon size={16} className={r.color} />
                      <span className="text-sm font-medium text-white">{r.label}</span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-cyan-300">{r.value}%</span>
                  </div>
                  <Progress value={r.value} indicatorClassName={`bg-gradient-to-r ${r.gradient}`} />
                </div>
              ))}
            </div>

            {/* Resource chart */}
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={resourceUsage}>
                <defs>
                  <linearGradient id="gpu-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cpu-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mem-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="gpu" name="GPU" stroke="#22D3EE" strokeWidth={2} fill="url(#gpu-grad)" />
                <Area type="monotone" dataKey="cpu" name="CPU" stroke="#3B82F6" strokeWidth={2} fill="url(#cpu-grad)" />
                <Area type="monotone" dataKey="memory" name="Memory" stroke="#34D399" strokeWidth={2} fill="url(#mem-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inference Time + Modality Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inference Time by Model</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Average inference latency per deployed model (ms)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={inferenceTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="model" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} unit="ms" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="time" name="Inference Time" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Modality Distribution</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Breakdown of scans by MRI modality
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={modalityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {modalityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(11,18,32,0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dataset Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database size={18} className="text-cyan-400" />
                  Dataset Statistics
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive breakdown of training data by region and modality
                </p>
              </div>
              <Badge variant="blue">{datasetStats.summary.totalScans.toLocaleString()} total scans</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Scans", value: datasetStats.summary.totalScans.toLocaleString(), icon: Database },
                { label: "Augmented", value: datasetStats.summary.augmented.toLocaleString(), icon: Layers },
                { label: "Brain MRI", value: datasetStats.summary.brainScans.toLocaleString(), icon: Brain },
                { label: "Spine MRI", value: datasetStats.summary.spineScans.toLocaleString(), icon: HardDrive },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                  <s.icon size={18} className="text-cyan-400 mx-auto mb-2" />
                  <p className="font-display text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Region + Modality charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-200 mb-3">By Region</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={datasetStats.byRegion} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {datasetStats.byRegion.map((entry, index) => (
                        <Cell key={`r-${index}`} fill={entry.fill} stroke="rgba(11,18,32,0.8)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200 mb-3">By Modality</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={datasetStats.byModality} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} width={50} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="value" name="Scans" radius={[0, 4, 4, 0]} barSize={18}>
                      {datasetStats.byModality.map((entry, index) => (
                        <Cell key={`m-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Train/Val/Test split */}
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-200 mb-3">Dataset Splits</p>
              <div className="flex h-8 rounded-xl overflow-hidden border border-white/[0.06]">
                {splitData.map((split) => (
                  <div
                    key={split.name}
                    className="flex items-center justify-center text-xs font-medium text-white transition-all"
                    style={{ width: `${split.value}%`, backgroundColor: split.fill + "40" }}
                  >
                    {split.name} {split.value}%
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Quality Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Quality Radar</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-dimensional model assessment across key metrics
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
