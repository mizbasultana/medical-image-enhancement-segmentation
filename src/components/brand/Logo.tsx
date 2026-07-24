import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({ className, animated = false }: { className?: string; animated?: boolean }) {
  const mark = (
    <svg viewBox="0 0 64 64" fill="none" className={cn("h-9 w-9", className)}>
      <defs>
        <linearGradient id="md-logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0B1220" stroke="url(#md-logo-grad)" strokeWidth="1.5" />
      <path
        d="M18 46V18l14 20 14-20v28"
        stroke="url(#md-logo-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="38" r="3.5" fill="#34D399" />
    </svg>
  );

  return (
    <div className="flex items-center gap-2.5">
      {animated ? (
        <motion.div
          initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glow-cyan rounded-2xl"
        >
          {mark}
        </motion.div>
      ) : (
        mark
      )}
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-white">
          MedhaDrishti
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
          AI
        </span>
      </div>
    </div>
  );
}
