import { motion } from "framer-motion";
import {
  Database,
  SlidersHorizontal,
  Sparkles,
  Scissors,
  Target,
  FileText,
} from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Dataset Analysis",
    description:
      "Profiling of MRI volumes with class distribution, slice coverage, and quality scoring across modalities.",
  },
  {
    icon: SlidersHorizontal,
    title: "Preprocessing",
    description:
      "N4 bias correction, skull stripping, intensity normalization, and resampling to isotropic voxels.",
  },
  {
    icon: Sparkles,
    title: "Enhancement",
    description:
      "Vision Transformer super-resolution and CLAHE contrast enhancement to recover fine structures.",
  },
  {
    icon: Scissors,
    title: "Segmentation",
    description:
      "Attention-UNet produces pixel-wise ROI masks with Dice coefficient scoring and boundary refinement.",
  },
  {
    icon: Target,
    title: "Evaluation",
    description:
      "Grad-CAM explainability, sensitivity-specificity analysis, and cross-validation across folds.",
  },
  {
    icon: FileText,
    title: "Clinical Report",
    description:
      "Structured findings with confidence intervals, annotated overlays, and radiologist sign-off.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="py-24 relative">
      <div className="section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Pipeline
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            End-to-end clinical workflow
          </h2>
          <p className="mt-4 text-slate-400">
            Six structured stages from raw acquisition to validated clinical report — each
            stage instrumented, logged, and auditable.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass-card p-6 h-full hover:border-cyan-500/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 border border-cyan-500/20">
                      <step.icon className="text-cyan-400" size={22} />
                    </div>
                    <span className="font-display text-3xl font-bold text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
