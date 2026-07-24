import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface AnimatedStatProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

export function AnimatedStat({ label, value, suffix = "", decimals = 0 }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted =
    value >= 1000
      ? formatNumber(Math.round(display))
      : display.toFixed(decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="font-display text-2xl sm:text-3xl font-bold text-white">
        {formatted}
        <span className="text-cyan-400">{suffix}</span>
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </motion.div>
  );
}
