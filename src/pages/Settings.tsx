import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Cpu,
  Database,
  Palette,
  Save,
  Globe,
  KeyRound,
  HardDrive,
  Clock,
  Sun,
  Moon,
  Languages,
  Accessibility,
  Eye,
  Volume2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/components/ui/toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "security", label: "Security", icon: Shield },
  { id: "models", label: "AI Models", icon: Cpu },
  { id: "storage", label: "Storage", icon: Database },
];

const languages = [
  { code: "en", label: "English", flag: "EN" },
  { code: "hi", label: "हिन्दी", flag: "HI" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "fr", label: "Français", flag: "FR" },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState("appearance");
  const { theme, setTheme, language, setLanguage, reducedMotion, setReducedMotion, highContrast, setHighContrast } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    scanComplete: true,
    reportReady: true,
    modelAlerts: false,
    weeklyDigest: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: true,
    auditLog: true,
    phiEncryption: true,
  });
  const [accessibility, setAccessibility] = useState({
    keyboardNav: true,
    screenReader: false,
    largeText: false,
    soundFeedback: false,
  });

  const handleSave = () => {
    toast({ type: "success", title: "Settings saved", description: "Your preferences have been updated" });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar tabs */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Card className="p-3 sticky top-20">
          <nav className="space-y-1" aria-label="Settings navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-foreground border border-cyan-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-cyan-400" : "text-muted-foreground"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>
      </motion.div>

      {/* Settings content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-3"
      >
        <AnimatePresence mode="wait">
          {activeTab === "appearance" && (
            <motion.div key="appearance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Customize the interface theme and language</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme switcher */}
                  <div>
                    <Label className="mb-3 block">Theme</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTheme("dark")}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl border p-4 transition-all",
                          theme === "dark"
                            ? "border-cyan-500/40 bg-cyan-500/5 glow-cyan"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 border border-white/10">
                          <Moon size={18} className="text-cyan-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                          <p className="text-xs text-muted-foreground">Navy dark theme</p>
                        </div>
                        {theme === "dark" && <CheckCircle2 className="absolute right-3 top-3 text-cyan-400" size={16} />}
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl border p-4 transition-all",
                          theme === "light"
                            ? "border-cyan-500/40 bg-cyan-500/5 glow-cyan"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-300">
                          <Sun size={18} className="text-amber-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">Light Mode</p>
                          <p className="text-xs text-muted-foreground">Clinical light theme</p>
                        </div>
                        {theme === "light" && <CheckCircle2 className="absolute right-3 top-3 text-cyan-400" size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="mb-3 block flex items-center gap-2">
                      <Languages size={14} /> Language
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code as typeof language)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border p-3 transition-all",
                            language === lang.code
                              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                              : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]"
                          )}
                        >
                          <span className="text-xs font-mono font-bold">{lang.flag}</span>
                          <span className="text-sm">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent color */}
                  <div>
                    <Label className="mb-3 block">Accent Color</Label>
                    <div className="flex gap-2">
                      {["#22D3EE", "#3B82F6", "#34D399", "#F59E0B", "#A78BFA"].map((c, i) => (
                        <button
                          key={c}
                          className={cn(
                            "h-10 w-10 rounded-xl border-2 transition-all hover:scale-110",
                            i === 0 ? "border-white shadow-lg" : "border-transparent hover:border-white/40"
                          )}
                          style={{ backgroundColor: c }}
                          aria-label={`Accent color ${c}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave}>
                      <Save size={16} /> Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Choose what alerts you receive</p>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: "scanComplete", label: "Scan Processing Complete", desc: "Notify when a scan finishes the pipeline", icon: CheckCircle2 },
                    { key: "reportReady", label: "Report Ready for Review", desc: "Notify when a clinical report is generated", icon: Bell },
                    { key: "modelAlerts", label: "Model Performance Alerts", desc: "Notify on accuracy drops or anomalies", icon: Zap },
                    { key: "weeklyDigest", label: "Weekly Activity Digest", desc: "Summary of pipeline activity every Monday", icon: Clock },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl p-3.5 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/15">
                          <item.icon className="text-cyan-400" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </div>
                  ))}
                  <div className="flex justify-end pt-3">
                    <Button onClick={handleSave}>
                      <Save size={16} /> Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "accessibility" && (
            <motion.div key="accessibility" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Enhance the interface for different needs</p>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: "keyboardNav", label: "Keyboard Navigation", desc: "Full keyboard support for all interactive elements", icon: KeyRound },
                    { key: "screenReader", label: "Screen Reader Optimization", desc: "Enhanced ARIA labels and announcements", icon: Eye },
                    { key: "largeText", label: "High Contrast Mode", desc: "Increase text contrast and border visibility", icon: Accessibility },
                    { key: "soundFeedback", label: "Sound Feedback", desc: "Audio cues for key actions and notifications", icon: Volume2 },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl p-3.5 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/15">
                          <item.icon className="text-violet-400" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={accessibility[item.key as keyof typeof accessibility]}
                        onCheckedChange={(v) => {
                          setAccessibility((prev) => ({ ...prev, [item.key]: v }));
                          if (item.key === "largeText") setHighContrast(v);
                          if (item.key === "keyboardNav") setReducedMotion(!v);
                        }}
                      />
                    </div>
                  ))}
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mt-3">
                    <p className="text-xs text-cyan-300 leading-relaxed">
                      MedhaDrishti AI is committed to WCAG 2.1 AA compliance. All interactive elements
                      support keyboard navigation, screen readers, and respect user motion preferences.
                    </p>
                  </div>
                  <div className="flex justify-end pt-3">
                    <Button onClick={handleSave}>
                      <Save size={16} /> Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Manage your account and clinical credentials</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-white/[0.06]">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white glow-cyan">
                      AI
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Dr. Arjun Iyer</p>
                      <p className="text-sm text-muted-foreground">Senior Radiologist · MedhaDrishti AI</p>
                      <Badge variant="success" className="mt-1.5">Verified Clinician</Badge>
                    </div>
                    <Button variant="secondary" size="sm" className="ml-auto">Change Photo</Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Dr. Arjun Iyer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="arjun.iyer@medhadrishti.ai" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Senior Radiologist" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License</Label>
                      <Input id="license" defaultValue="MCI-2018-45291" readOnly />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave}>
                      <Save size={16} /> Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Security & Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Authentication and data protection controls</p>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: "twoFactor", label: "Two-Factor Authentication", desc: "Require OTP on every login", icon: KeyRound },
                    { key: "sessionTimeout", label: "Auto Session Timeout", desc: "Sign out after 15 minutes of inactivity", icon: Clock },
                    { key: "auditLog", label: "Audit Trail Logging", desc: "Record all PHI access events", icon: Shield },
                    { key: "phiEncryption", label: "PHI Encryption at Rest", desc: "AES-256 encryption for patient data", icon: HardDrive },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl p-3.5 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                          <item.icon className="text-emerald-400" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={security[item.key as keyof typeof security]}
                        onCheckedChange={(v) => setSecurity((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </div>
                  ))}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mt-3">
                    <p className="text-xs text-emerald-300 leading-relaxed">
                      All security controls are HIPAA and GDPR compliant. Patient data is encrypted with
                      AES-256 at rest and TLS 1.3 in transit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "models" && (
            <motion.div key="models" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Configure inference and training parameters</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "MD-ViT-Enhance", version: "v3.2.1", status: "Active", enabled: true },
                    { name: "MD-UNet-Seg", version: "v2.8.0", status: "Active", enabled: true },
                    { name: "MD-GradCAM-X", version: "v1.5.3", status: "Active", enabled: true },
                    { name: "MD-CNN-Classifier", version: "v4.0.0", status: "Training", enabled: false },
                  ].map((model) => (
                    <div key={model.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15">
                          <Cpu className="text-cyan-400" size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{model.name}</p>
                          <p className="text-xs text-muted-foreground">{model.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={model.status === "Active" ? "success" : "warning"}>{model.status}</Badge>
                        <Switch defaultChecked={model.enabled} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "storage" && (
            <motion.div key="storage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Storage & Data Management</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Manage DICOM storage and retention policies</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <HardDrive size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium text-foreground">Storage Usage</span>
                      </div>
                      <span className="text-sm font-mono text-cyan-300">2.4 TB / 5 TB</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: "48%" }} />
                    </div>
                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                      <span>DICOM Archive: 1.8 TB</span>
                      <span>Reports: 0.4 TB</span>
                      <span>Models: 0.2 TB</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Retention Policy</Label>
                    <select className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground backdrop-blur-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer">
                      <option>7 years (Standard clinical)</option>
                      <option>10 years (Extended)</option>
                      <option>Indefinite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <select className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground backdrop-blur-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer">
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave}>
                      <Save size={16} /> Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
