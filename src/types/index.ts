export type ScanStatus = "completed" | "processing" | "queued" | "failed";

export interface MriScan {
  id: string;
  patientId: string;
  patientName: string;
  modality: "MRI T1" | "MRI T2" | "MRI FLAIR" | "MRI DWI";
  region: "Brain" | "Spine" | "Knee" | "Chest";
  uploadedAt: string;
  status: ScanStatus;
  confidence: number;
  enhancementScore: number;
  segmentationCoverage: number;
  findings: string[];
  thumbnail: string;
}

export interface ActivityItem {
  id: string;
  type: "upload" | "enhancement" | "segmentation" | "report" | "gradcam";
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  status: "active" | "idle" | "training";
  accuracy: number;
  latencyMs: number;
  type: string;
}

export interface GpuInfo {
  name: string;
  utilization: number;
  memoryUsed: number;
  memoryTotal: number;
  temperature: number;
  powerDraw: number;
  powerLimit: number;
}
