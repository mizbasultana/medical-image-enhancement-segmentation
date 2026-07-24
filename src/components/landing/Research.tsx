import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Cpu, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const papers = [
  {
    title: "Attention-Enhanced UNet for Brain Lesion Segmentation",
    venue: "MICCAI 2024",
    metric: "Dice 0.912",
    icon: Brain,
  },
  {
    title: "Vision Transformers for MRI Super-Resolution",
    venue: "IEEE TMI 2024",
    metric: "PSNR 34.2 dB",
    icon: Cpu,
  },
  {
    title: "Grad-CAM for Clinical Explainability in Neuroimaging",
    venue: "Nature Machine Intelligence",
    metric: "Trust Score 0.89",
    icon: Microscope,
  },
];

export function Research() {
  return (
    <section id="research" className="py-24 relative">
      <div className="section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Research
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            Peer-reviewed, clinically validated
          </h2>
          <p className="mt-4 text-slate-400">
            Our models are grounded in published research and validated against
            board-certified radiologist annotations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {papers.map((paper, i) => (
            <motion.div
              key={paper.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full p-6 hover:border-cyan-500/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/5 border border-white/10">
                    <paper.icon className="text-violet-400" size={20} />
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    {paper.metric}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-white leading-snug mb-2">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-500">{paper.venue}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Card className="relative overflow-hidden p-8 lg:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-emerald-500/10" />
            <div className="relative">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Ready to augment your radiology workflow?
              </h3>
              <p className="mt-3 text-slate-400 max-w-lg mx-auto">
                Launch the interactive demo and explore the full MedhaDrishti AI pipeline
                with sample MRI cases.
              </p>
              <div className="mt-6 flex justify-center">
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Launch Demo <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
