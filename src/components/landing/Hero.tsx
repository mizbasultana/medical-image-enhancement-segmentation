import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MriIllustration } from "@/components/landing/MriIllustration";
import { AnimatedStat } from "@/components/landing/AnimatedStat";
import { stats } from "@/data/mock";

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid mask-radial opacity-30" />

      <div className="section-pad relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3.5 py-1.5 mb-6"
            >
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-xs font-medium text-cyan-300">
                Deep Learning Clinical Decision Support
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white"
            >
              AI Powered MRI <br />
              Enhancement & <span className="text-gradient-cyan">ROI Segmentation</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl"
            >
              Clinical Decision Support System using Deep Learning. Enhance, segment, and
              explain MRI scans with state-of-the-art vision transformers — built for
              radiologists, trusted by clinicians.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Try Demo <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/dashboard">
                  <Play size={16} /> Explore Dashboard
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex items-center gap-2 text-xs text-slate-500"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              HIPAA-aware · CE-Class IIa · DICOM 3.0 compliant
            </motion.div>

            {/* Animated stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <AnimatedStat label="MRI Scans" value={stats.mriScans} suffix="+" />
              <AnimatedStat label="Accuracy" value={stats.accuracy} suffix="%" decimals={1} />
              <AnimatedStat label="Inference" value={stats.inferenceTime} suffix="ms" />
              <AnimatedStat label="Patients" value={stats.patients} suffix="+" />
            </motion.div>
          </div>

          {/* Right: MRI illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MriIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
