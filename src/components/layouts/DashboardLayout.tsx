import { useState, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  Sparkles,
  Scissors,
  Eye,
  BarChart3,
  FileText,
  Settings,
  Microscope,
  Menu,
  X,
  Activity,
  ChevronRight,
  Search,
  Bot,
  Send,
  Cpu,
  Server,
  Wifi,
  Sun,
  Moon,
  XCircle,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { gpuInfo, recentScans } from "@/data/mock";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { FloatingOrbs } from "@/components/ui/floating-orbs";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", path: "/upload", icon: Upload },
  { label: "Enhancement", path: "/enhancement", icon: Sparkles },
  { label: "Segmentation", path: "/segmentation", icon: Scissors },
  { label: "Grad-CAM", path: "/grad-cam", icon: Eye },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Research", path: "/research", icon: Microscope },
  { label: "Settings", path: "/settings", icon: Settings },
];

const aiSuggestions = [
  "Show recent high-confidence scans",
  "What's the current GPU utilization?",
  "Compare model performance",
  "Generate a summary report",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function AiAssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello, Dr. Iyer. I'm MedhaDrishti AI Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTimeout(() => {
      const responses: Record<string, string> = {
        gpu: `Current GPU utilization is ${gpuInfo.utilization}% with ${gpuInfo.memoryUsed.toFixed(1)}/${gpuInfo.memoryTotal}GB memory in use. Temperature is ${gpuInfo.temperature}°C — all within normal operating range.`,
        scan: "There are 3 high-confidence scans completed today. MR-2024-0891 (96.4%) and MR-2024-0887 (97.1%) are ready for review.",
        model: "MD-ViT-Enhance leads with 96.4% accuracy at 142ms latency. MD-UNet-Seg achieves 94.2% Dice score at 98ms. MD-GradCAM-X provides explainability at 64ms.",
        report: "I can help generate a clinical report. Navigate to the Reports page and select a completed scan to view the full hospital report with patient details, MRI summary, and clinical recommendations.",
      };
      const key = Object.keys(responses).find((k) => text.toLowerCase().includes(k));
      const reply = key ? responses[key] : "I can help with scan analysis, GPU status, model performance, and report generation. Try asking about recent scans or GPU utilization.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    }, 800);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-50 h-full w-[380px] max-w-[90vw] glass-strong border-l border-white/10 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20">
            <Bot size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 text-foreground"
                  : "glass text-foreground"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[10px] rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-cyan-500/20 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/40 focus:outline-none"
          />
          <Button size="icon" onClick={() => send(input)}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function PatientSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return recentScans.filter(
      (s) =>
        s.patientName.toLowerCase().includes(query.toLowerCase()) ||
        s.patientId.toLowerCase().includes(query.toLowerCase()) ||
        s.id.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -10 }}
        className="w-full max-w-lg mx-4 glass-strong rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <Search size={18} className="text-cyan-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name, ID, or scan ID..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === "" ? (
            <p className="text-sm text-muted-foreground text-center py-8">Start typing to search patients</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No patients found for "{query}"</p>
          ) : (
            results.map((scan) => (
              <Link
                key={scan.id}
                to="/reports"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15">
                  <span className="text-xs font-semibold text-cyan-400">{scan.patientId.slice(-2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{scan.patientName}</p>
                  <p className="text-xs text-muted-foreground">{scan.patientId} · {scan.modality}</p>
                </div>
                <Badge variant={scan.status === "completed" ? "success" : "neutral"}>
                  {scan.status}
                </Badge>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModelHealthCard() {
  const services = [
    { label: "GPU", icon: Cpu, status: "Operational", color: "text-emerald-400", value: `${gpuInfo.utilization}%` },
    { label: "Server", icon: Server, status: "Online", color: "text-emerald-400", value: "4 nodes" },
    { label: "API", icon: Wifi, status: "Responsive", color: "text-emerald-400", value: "52ms" },
  ];
  return (
    <div className="p-3">
      <div className="glass rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-foreground">Model Health</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Go
          </span>
        </div>
        <div className="space-y-2.5">
          {services.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <s.icon size={14} className={s.color} />
              <span className="text-[11px] text-muted-foreground flex-1">{s.label}</span>
              <span className="text-[10px] font-mono text-foreground">{s.value}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <p className="text-[11px] text-muted-400 mb-1 font-mono truncate">{gpuInfo.name}</p>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>GPU Util</span>
                <span className="font-mono text-cyan-300">{gpuInfo.utilization}%</span>
              </div>
              <Progress value={gpuInfo.utilization} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>VRAM</span>
                <span className="font-mono text-cyan-300">{gpuInfo.memoryUsed.toFixed(1)}/{gpuInfo.memoryTotal}GB</span>
              </div>
              <Progress
                value={(gpuInfo.memoryUsed / gpuInfo.memoryTotal) * 100}
                className="h-1"
                indicatorClassName="bg-gradient-to-r from-emerald-400 to-teal-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const currentLabel =
    navItems.find((n) => location.pathname.startsWith(n.path))?.label ?? "Dashboard";

  return (
    <div className="min-h-screen flex">
      <FloatingOrbs />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/[0.06] bg-navy-950/40 backdrop-blur-xl z-30">
        <div className="flex h-16 items-center px-5 border-b border-white/[0.06]">
          <Link to="/" aria-label="Go to landing page">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-foreground border border-cyan-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-cyan-400" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  size={18}
                />
                {item.label}
                {active && <ChevronRight className="ml-auto h-4 w-4 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>
        <ModelHealthCard />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-64 border-r border-white/[0.08] bg-navy-950 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1 p-3" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-cyan-500/15 text-foreground border border-cyan-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      <item.icon size={18} className={active ? "text-cyan-400" : "text-muted-foreground"} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-navy-950/60 backdrop-blur-xl px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-semibold text-foreground">{currentLabel}</h1>
            <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronRight size={12} />
              MedhaDrishti AI
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground hover:border-cyan-500/20 hover:text-foreground transition-all"
              aria-label="Search patients"
            >
              <Search size={15} />
              <span className="hidden md:inline">Search patients...</span>
              <kbd className="hidden md:inline text-[10px] border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Operational</span>
            </div>

            <button
              onClick={() => setAiOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 text-cyan-400 hover:brightness-110 transition-all"
              aria-label="Open AI Assistant"
            >
              <Bot size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-foreground">Dr. Arjun Iyer</p>
                <p className="text-[10px] text-muted-foreground">Senior Radiologist</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                AI
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {aiOpen && <AiAssistantPanel onClose={() => setAiOpen(false)} />}
      </AnimatePresence>

      {/* Patient Search Modal */}
      <AnimatePresence>
        {searchOpen && <PatientSearch onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
