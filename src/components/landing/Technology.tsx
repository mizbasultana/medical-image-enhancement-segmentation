import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const technologies = [
  {
    name: "PyTorch",
    description: "Deep learning framework powering model training and inference.",
    accent: "#EE4C2B",
  },
  {
    name: "OpenCV",
    description: "Computer vision library for preprocessing and image operations.",
    accent: "#22D3EE",
  },
  {
    name: "Vision Transformers",
    description: "Attention-based architecture for image enhancement tasks.",
    accent: "#3B82F6",
  },
  {
    name: "UNet",
    description: "Encoder-decoder network for semantic segmentation of ROIs.",
    accent: "#34D399",
  },
  {
    name: "CNN",
    description: "Convolutional networks for feature extraction and classification.",
    accent: "#A78BFA",
  },
];

export function Technology() {
  return (
    <section id="technology" className="py-24 relative">
      <div className="section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Stack
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            Built on proven research technology
          </h2>
          <p className="mt-4 text-slate-400">
            MedhaDrishti AI leverages the most validated open-source tools and architectures
            in medical imaging research.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="group h-full p-5 text-center hover:border-white/20 transition-all hover:-translate-y-1">
                <div
                  className="mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white transition-all group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${tech.accent}33, ${tech.accent}11)`,
                    border: `1px solid ${tech.accent}33`,
                    boxShadow: `0 0 24px -8px ${tech.accent}66`,
                  }}
                >
                  {tech.name.charAt(0)}
                </div>
                <h3 className="font-display text-sm font-semibold text-white mb-1.5">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tech.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
