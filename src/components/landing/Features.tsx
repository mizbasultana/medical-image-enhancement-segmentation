import { motion } from "framer-motion";
import {
  Sparkles,
  Scissors,
  Eye,
  BarChart3,
  FileText,
  Database,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "MRI Enhancement",
    description:
      "CLAHE, denoising, and super-resolution powered by Vision Transformers to recover diagnostic detail from low-quality scans.",
    gradient: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: Scissors,
    title: "ROI Segmentation",
    description:
      "Attention-based UNet isolates regions of interest — ventricles, lesions, and tumors — with sub-millimeter precision.",
    gradient: "from-blue-500/20 to-indigo-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Eye,
    title: "Grad-CAM Explainability",
    description:
      "Gradient-weighted Class Activation Maps reveal exactly which image regions drove each prediction for clinical trust.",
    gradient: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track model accuracy, inference latency, and case throughput across modalities and anatomical regions in real time.",
    gradient: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-400",
  },
  {
    icon: FileText,
    title: "Clinical Reports",
    description:
      "Auto-generate structured DICOM-annotated reports with findings, confidence scores, and radiologist sign-off workflow.",
    gradient: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Database,
    title: "Dataset Analysis",
    description:
      "Comprehensive dataset profiling with class balance, augmentation tracking, and cross-validation fold management.",
    gradient: "from-rose-500/20 to-pink-500/5",
    iconColor: "text-rose-400",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Capabilities
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            A complete deep learning pipeline for MRI
          </h2>
          <p className="mt-4 text-slate-400">
            From raw DICOM upload to signed clinical report — every stage of the radiology
            workflow, augmented by state-of-the-art neural networks.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="group h-full p-6 hover:border-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} border border-white/10 mb-4`}
                >
                  <feature.icon className={feature.iconColor} size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
