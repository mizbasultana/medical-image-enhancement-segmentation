import type { ActivityItem, GpuInfo, ModelInfo, MriScan } from "@/types";

export const recentScans: MriScan[] = [
  {
    id: "MR-2024-0891",
    patientId: "PT-4471",
    patientName: "Aarav Sharma",
    modality: "MRI T1",
    region: "Brain",
    uploadedAt: "2024-07-24T08:14:00Z",
    status: "completed",
    confidence: 96.4,
    enhancementScore: 0.91,
    segmentationCoverage: 0.88,
    findings: ["Mild cortical atrophy", "No midline shift", "Normal ventricular size"],
    thumbnail: "brain-1",
  },
  {
    id: "MR-2024-0890",
    patientId: "PT-4472",
    patientName: "Diya Patel",
    modality: "MRI FLAIR",
    region: "Brain",
    uploadedAt: "2024-07-24T07:42:00Z",
    status: "processing",
    confidence: 0,
    enhancementScore: 0.84,
    segmentationCoverage: 0,
    findings: ["Hyperintensity detected — parietal lobe", "Review recommended"],
    thumbnail: "brain-2",
  },
  {
    id: "MR-2024-0889",
    patientId: "PT-4473",
    patientName: "Rohan Mehta",
    modality: "MRI T2",
    region: "Spine",
    uploadedAt: "2024-07-24T06:55:00Z",
    status: "completed",
    confidence: 94.2,
    enhancementScore: 0.89,
    segmentationCoverage: 0.92,
    findings: ["L4-L5 disc bulge", "No spinal cord compression"],
    thumbnail: "spine-1",
  },
  {
    id: "MR-2024-0888",
    patientId: "PT-4474",
    patientName: "Ananya Reddy",
    modality: "MRI DWI",
    region: "Brain",
    uploadedAt: "2024-07-23T22:10:00Z",
    status: "queued",
    confidence: 0,
    enhancementScore: 0,
    segmentationCoverage: 0,
    findings: ["Awaiting processing"],
    thumbnail: "brain-3",
  },
  {
    id: "MR-2024-0887",
    patientId: "PT-4475",
    patientName: "Vikram Nair",
    modality: "MRI T1",
    region: "Knee",
    uploadedAt: "2024-07-23T19:31:00Z",
    status: "completed",
    confidence: 97.1,
    enhancementScore: 0.93,
    segmentationCoverage: 0.9,
    findings: ["Medial meniscus intact", "No effusion"],
    thumbnail: "knee-1",
  },
  {
    id: "MR-2024-0886",
    patientId: "PT-4476",
    patientName: "Sara Khan",
    modality: "MRI T2",
    region: "Brain",
    uploadedAt: "2024-07-23T16:08:00Z",
    status: "failed",
    confidence: 0,
    enhancementScore: 0,
    segmentationCoverage: 0,
    findings: ["Motion artifact — rescan advised"],
    thumbnail: "brain-4",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    type: "report",
    title: "Clinical report generated",
    description: "Report MR-2024-0891 for Aarav Sharma signed off by Dr. Iyer.",
    timestamp: "2 min ago",
    user: "Dr. Iyer",
  },
  {
    id: "a2",
    type: "segmentation",
    title: "ROI segmentation completed",
    description: "Ventricular region segmented with 88% coverage on MR-2024-0891.",
    timestamp: "8 min ago",
    user: "Pipeline",
  },
  {
    id: "a3",
    type: "gradcam",
    title: "Grad-CAM heatmap rendered",
    description: "Explainability map exported for case MR-2024-0889.",
    timestamp: "21 min ago",
    user: "Pipeline",
  },
  {
    id: "a4",
    type: "enhancement",
    title: "Image enhancement finished",
    description: "CLAHE + denoising applied to MR-2024-0890 (FLAIR).",
    timestamp: "34 min ago",
    user: "Pipeline",
  },
  {
    id: "a5",
    type: "upload",
    title: "New scan uploaded",
    description: "MRI DWI for Ananya Reddy queued for preprocessing.",
    timestamp: "1 hr ago",
    user: "Technician Rao",
  },
];

export const models: ModelInfo[] = [
  {
    name: "MD-ViT-Enhance",
    version: "v3.2.1",
    status: "active",
    accuracy: 96.4,
    latencyMs: 142,
    type: "Vision Transformer",
  },
  {
    name: "MD-UNet-Seg",
    version: "v2.8.0",
    status: "active",
    accuracy: 94.2,
    latencyMs: 98,
    type: "UNet + Attention",
  },
  {
    name: "MD-GradCAM-X",
    version: "v1.5.3",
    status: "active",
    accuracy: 92.8,
    latencyMs: 64,
    type: "Explainability",
  },
  {
    name: "MD-CNN-Classifier",
    version: "v4.0.0",
    status: "training",
    accuracy: 91.5,
    latencyMs: 52,
    type: "ResNet-152",
  },
];

export const gpuInfo: GpuInfo = {
  name: "NVIDIA A100 80GB SXM4",
  utilization: 73,
  memoryUsed: 54.2,
  memoryTotal: 80,
  temperature: 68,
  powerDraw: 312,
  powerLimit: 400,
};

export const accuracyTrend = [
  { month: "Jan", value: 91.2 },
  { month: "Feb", value: 92.1 },
  { month: "Mar", value: 93.0 },
  { month: "Apr", value: 93.4 },
  { month: "May", value: 94.1 },
  { month: "Jun", value: 95.0 },
  { month: "Jul", value: 96.4 },
];

export const inferenceTrend = [
  { week: "W1", enhancement: 158, segmentation: 112, gradcam: 71 },
  { week: "W2", enhancement: 149, segmentation: 105, gradcam: 68 },
  { week: "W3", enhancement: 142, segmentation: 98, gradcam: 64 },
  { week: "W4", enhancement: 138, segmentation: 95, gradcam: 61 },
];

export const modalityDistribution = [
  { name: "MRI T1", value: 38, fill: "#22D3EE" },
  { name: "MRI T2", value: 27, fill: "#3B82F6" },
  { name: "MRI FLAIR", value: 21, fill: "#34D399" },
  { name: "MRI DWI", value: 14, fill: "#A78BFA" },
];

export const regionDistribution = [
  { name: "Brain", value: 58 },
  { name: "Spine", value: 19 },
  { name: "Knee", value: 15 },
  { name: "Chest", value: 8 },
];

export const stats = {
  mriScans: 48290,
  accuracy: 96.4,
  inferenceTime: 142,
  patients: 12847,
};

export const trainingHistory = [
  { epoch: 1, trainLoss: 1.82, valLoss: 1.91, accuracy: 62.1 },
  { epoch: 2, trainLoss: 1.45, valLoss: 1.58, accuracy: 68.4 },
  { epoch: 3, trainLoss: 1.12, valLoss: 1.29, accuracy: 74.2 },
  { epoch: 4, trainLoss: 0.89, valLoss: 1.05, accuracy: 79.8 },
  { epoch: 5, trainLoss: 0.72, valLoss: 0.88, accuracy: 83.5 },
  { epoch: 6, trainLoss: 0.58, valLoss: 0.76, accuracy: 86.9 },
  { epoch: 7, trainLoss: 0.47, valLoss: 0.68, accuracy: 89.1 },
  { epoch: 8, trainLoss: 0.39, valLoss: 0.62, accuracy: 91.0 },
  { epoch: 9, trainLoss: 0.33, valLoss: 0.58, accuracy: 92.4 },
  { epoch: 10, trainLoss: 0.28, valLoss: 0.55, accuracy: 93.6 },
  { epoch: 11, trainLoss: 0.24, valLoss: 0.53, accuracy: 94.5 },
  { epoch: 12, trainLoss: 0.21, valLoss: 0.52, accuracy: 95.1 },
  { epoch: 13, trainLoss: 0.18, valLoss: 0.51, accuracy: 95.7 },
  { epoch: 14, trainLoss: 0.16, valLoss: 0.51, accuracy: 96.0 },
  { epoch: 15, trainLoss: 0.14, valLoss: 0.52, accuracy: 96.2 },
  { epoch: 16, trainLoss: 0.13, valLoss: 0.53, accuracy: 96.3 },
  { epoch: 17, trainLoss: 0.12, valLoss: 0.54, accuracy: 96.4 },
  { epoch: 18, trainLoss: 0.11, valLoss: 0.55, accuracy: 96.4 },
];

export const resourceUsage = [
  { time: "00:00", gpu: 45, cpu: 32, memory: 58 },
  { time: "04:00", gpu: 52, cpu: 38, memory: 61 },
  { time: "08:00", gpu: 68, cpu: 51, memory: 67 },
  { time: "10:00", gpu: 79, cpu: 64, memory: 72 },
  { time: "12:00", gpu: 85, cpu: 71, memory: 76 },
  { time: "14:00", gpu: 73, cpu: 58, memory: 70 },
  { time: "16:00", gpu: 81, cpu: 66, memory: 74 },
  { time: "18:00", gpu: 64, cpu: 49, memory: 65 },
  { time: "20:00", gpu: 48, cpu: 35, memory: 60 },
  { time: "23:59", gpu: 41, cpu: 28, memory: 56 },
];

export const inferenceTimeData = [
  { model: "ViT-Enhance", time: 142 },
  { model: "UNet-Seg", time: 98 },
  { model: "GradCAM-X", time: 64 },
  { model: "CNN-Clf", time: 52 },
];

export const datasetStats = {
  byRegion: [
    { name: "Brain MRI", value: 28400, fill: "#22D3EE" },
    { name: "Spine MRI", value: 19890, fill: "#3B82F6" },
  ],
  byModality: [
    { name: "T1", value: 14200, fill: "#22D3EE" },
    { name: "T2", value: 10800, fill: "#3B82F6" },
    { name: "FLAIR", value: 13400, fill: "#34D399" },
    { name: "STIR", value: 9890, fill: "#A78BFA" },
  ],
  summary: {
    totalScans: 48290,
    brainScans: 28400,
    spineScans: 19890,
    t1: 14200,
    t2: 10800,
    flair: 13400,
    stir: 9890,
    augmented: 192800,
    splits: { train: 70, val: 15, test: 15 },
  },
};

export const enhancementMetrics = {
  psnr: 34.2,
  ssim: 0.943,
  mse: 0.0021,
  rmse: 0.0458,
  entropy: 6.82,
  fsim: 0.918,
  vif: 0.876,
  niqe: 2.14,
  piqe: 3.67,
};

export const segmentationMetrics = {
  dice: 0.912,
  jaccard: 0.841,
  accuracy: 0.964,
  precision: 0.928,
  recall: 0.917,
  sensitivity: 0.923,
  specificity: 0.971,
  f1: 0.922,
  hausdorff: 3.84,
};
