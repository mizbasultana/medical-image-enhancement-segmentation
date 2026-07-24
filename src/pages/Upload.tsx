import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileImage,
  CheckCircle2,
  X,
  Loader2,
  Brain,
  Bone,
  ScanLine,
  User,
  Calendar,
  Eye,
  RotateCcw,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AiPipeline } from "@/components/AiPipeline";
import { ConfidencePanel } from "@/components/ConfidencePanel";
import { ResultSummary } from "@/components/ResultSummary";
import { useToast } from "@/components/ui/toast";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  format: string;
  status: "uploading" | "done" | "error";
  progress: number;
  previewUrl?: string;
}

const acceptedFormats = [".nii", ".nii.gz", ".dcm", ".png", ".jpg", ".jpeg"];
const formatBadges = ["NIfTI", "NII", "DICOM", "PNG", "JPEG"];

const modalityOptions = ["T1", "T2", "FLAIR", "STIR"] as const;
const regionOptions = [
  { label: "Brain", icon: Brain },
  { label: "Spine", icon: Bone },
];
const genderOptions = ["Male", "Female", "Other"] as const;

function detectFormat(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".nii.gz") || lower.endsWith(".nii")) return "NIfTI";
  if (lower.endsWith(".dcm")) return "DICOM";
  if (lower.endsWith(".png")) return "PNG";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "JPEG";
  return "Unknown";
}

export function Upload() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [modality, setModality] = useState<string>("T1");
  const [region, setRegion] = useState<string>("Brain");
  const [gender, setGender] = useState<string>("Male");
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (file: File, id: string) => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 22;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "done" } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: prog } : f))
        );
      }
    }, 280);
  };

  const addFiles = (fileList: FileList | File[]) => {
    Array.from(fileList).forEach((f) => {
      const id = Math.random().toString(36).slice(2);
      const format = detectFormat(f.name);
      const previewUrl =
        format === "PNG" || format === "JPEG" ? URL.createObjectURL(f) : undefined;
      setFiles((prev) => [
        ...prev,
        {
          id,
          name: f.name,
          size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
          format,
          status: "uploading",
          progress: 0,
          previewUrl,
        },
      ]);
      simulateUpload(f, id);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  };

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const totalProgress =
    files.length > 0
      ? files.reduce((sum, f) => sum + f.progress, 0) / files.length
      : 0;

  const handleSubmitPipeline = () => {
    setPipelineActive(true);
    setPipelineComplete(false);
    toast({ type: "info", title: "Pipeline started", description: `${files.length} scan(s) submitted for AI analysis` });
  };

  const handlePipelineComplete = () => {
    setPipelineActive(false);
    setPipelineComplete(true);
    toast({ type: "success", title: "Analysis complete", description: "AI pipeline finished — results ready for review" });
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upload MRI Scans</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop or browse — supported formats below
                  </p>
                </div>
                <div className="hidden sm:flex flex-wrap gap-1.5">
                  {formatBadges.map((fmt) => (
                    <Badge key={fmt} variant="blue">
                      {fmt}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer",
                  dragActive
                    ? "border-cyan-500/50 bg-cyan-500/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={acceptedFormats.join(",")}
                  className="sr-only"
                  onChange={handleSelect}
                />
                <motion.div
                  animate={dragActive ? { y: -8, scale: 1.05 } : { y: 0, scale: 1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 border border-cyan-500/20 mb-4"
                >
                  <UploadCloud className="text-cyan-400" size={28} />
                </motion.div>
                <p className="font-display text-lg font-semibold text-white">
                  Drop MRI files here
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  NIfTI · NII · DICOM · PNG · JPEG — up to 2 GB per file
                </p>
                <Button variant="secondary" size="sm" className="mt-4" type="button">
                  <ScanLine size={14} /> Browse files
                </Button>
              </label>

              {/* Overall progress */}
              {files.length > 0 && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">
                        Overall upload progress · {files.length} file{files.length > 1 ? "s" : ""}
                      </span>
                      <span className="font-mono text-cyan-300">
                        {Math.round(totalProgress)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          allDone
                            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                            : "bg-gradient-to-r from-cyan-400 to-blue-500"
                        )}
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                  </div>
                  {allDone && (
                    <Badge variant="success">
                      <CheckCircle2 size={12} className="mr-1" /> All uploaded
                    </Badge>
                  )}
                </div>
              )}

              {/* File list */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 space-y-2"
                  >
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/15 shrink-0">
                          <FileImage className="text-cyan-400" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <Badge variant="neutral" className="shrink-0">
                              {file.format}
                            </Badge>
                            <span className="text-xs text-slate-500 ml-auto shrink-0">
                              {file.size}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                file.status === "done"
                                  ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                                  : "bg-gradient-to-r from-cyan-400 to-blue-500"
                              )}
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                        {file.status === "done" ? (
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="text-cyan-400 hover:text-cyan-300 shrink-0"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                        ) : (
                          <Loader2 className="text-cyan-400 animate-spin shrink-0" size={18} />
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-slate-500 hover:text-white shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} className="text-cyan-400" />
                Patient Information
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Clinical metadata for pipeline routing
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  placeholder="PT-4477"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-1.5">
                    <Calendar size={12} /> Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {genderOptions.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          "rounded-lg border px-1 py-2.5 text-xs font-medium transition-all",
                          gender === g
                            ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>MRI Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {regionOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setRegion(opt.label)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                        region === opt.label
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      <opt.icon size={16} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>MRI Modality</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {modalityOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setModality(m)}
                      className={cn(
                        "rounded-lg border px-1 py-2.5 text-xs font-medium transition-all",
                        modality === m
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <p className="text-xs text-amber-300 leading-relaxed">
                  Files are encrypted at rest with AES-256 and transmitted via TLS 1.3.
                  Patient PHI is never stored in model training pipelines.
                </p>
              </div>

              <Button className="w-full" size="lg" disabled={!allDone || pipelineActive} onClick={handleSubmitPipeline}>
                <FileCheck2 size={18} /> {pipelineActive ? "Processing..." : "Submit to Pipeline"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Image Preview + Metadata */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye size={18} className="text-cyan-400" />
                  Image Preview
                </CardTitle>
                {previewFile && (
                  <Badge variant={previewFile.status === "done" ? "success" : "blue"}>
                    {previewFile.format}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {previewFile ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-navy-900 flex items-center justify-center">
                    {previewFile.previewUrl ? (
                      <img
                        src={previewFile.previewUrl}
                        alt={previewFile.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-center p-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/5 border border-cyan-500/20">
                          <FileImage className="text-cyan-400" size={36} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {previewFile.format} Preview
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            DICOM and NIfTI previews render after server-side decoding
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono truncate">
                    {previewFile.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 mb-3">
                    <Eye size={28} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500">
                    Upload a file and click the preview icon to view it here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metadata Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>File Metadata</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Extracted DICOM / NIfTI header information
              </p>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {previewFile ? (
                <>
                  {[
                    { label: "File Name", value: previewFile.name },
                    { label: "Format", value: previewFile.format },
                    { label: "File Size", value: previewFile.size },
                    { label: "Patient ID", value: patientId || "—" },
                    { label: "Age", value: age || "—" },
                    { label: "Gender", value: gender },
                    { label: "MRI Type", value: region },
                    { label: "Modality", value: modality },
                    { label: "Dimensions", value: "512 × 512 × 128" },
                    { label: "Voxel Size", value: "1.0 × 1.0 × 1.0 mm" },
                    { label: "Slice Count", value: "128" },
                    { label: "Bits Per Pixel", value: "16" },
                    { label: "Study Date", value: new Date().toISOString().split("T")[0] },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
                    >
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-xs font-mono font-medium text-slate-200 truncate ml-2 max-w-[60%] text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileImage size={32} className="text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">
                    Select a file to view metadata
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Uploaded scans will flow through these automated stages
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: "Preprocessing", desc: "N4 bias correction, skull stripping, intensity normalization", status: "Auto" },
                { step: "Enhancement", desc: "ViT super-resolution + CLAHE contrast enhancement", status: "Auto" },
                { step: "Segmentation", desc: "Attention-UNet ROI mask generation", status: "Auto" },
                { step: "Report", desc: "Structured findings + Grad-CAM overlay", status: "Review" },
              ].map((stage, i) => (
                <div
                  key={stage.step}
                  className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xs font-bold text-white/20">
                      0{i + 1}
                    </span>
                    <Badge variant={stage.status === "Auto" ? "blue" : "warning"}>
                      {stage.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{stage.step}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Pipeline Animation */}
      <AiPipeline active={pipelineActive} onComplete={handlePipelineComplete} />

      {/* Results after pipeline completion */}
      <AnimatePresence>
        {pipelineComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            <ConfidencePanel
              confidence={96.4}
              riskLevel="Low"
              inferenceTime={142}
              modelVersion="MD-ViT-v3.2"
              gpuUsage={73}
              memoryUsage={67}
              status="operational"
            />
            <ResultSummary
              mriType={`${modality} Weighted`}
              detectedRegion={region}
              enhancementComplete={true}
              segmentationComplete={true}
              confidence={96.4}
              recommendation="Findings are within normal parameters. The AI model predicts with 96.4% confidence based on enhancement and segmentation analysis. Routine follow-up recommended in 6 months."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
