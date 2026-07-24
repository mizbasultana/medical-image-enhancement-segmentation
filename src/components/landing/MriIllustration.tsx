import { motion } from "framer-motion";

export function MriIllustration({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative aspect-square w-full max-w-md mx-auto">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="400" y2="400">
                <stop stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="1" stopColor="#34D399" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="none" stroke="url(#ring-grad)" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="180" fill="none" stroke="url(#ring-grad)" strokeWidth="2" strokeDasharray="60 360" />
          </svg>
        </motion.div>

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8"
        >
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <circle cx="200" cy="200" r="160" fill="none" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="#22D3EE" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="40 300" />
          </svg>
        </motion.div>

        {/* Brain scan visualization */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-16 rounded-full overflow-hidden border border-cyan-500/20"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.15), rgba(11,18,32,0.9) 70%)",
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <defs>
              <radialGradient id="brain-grad" cx="50%" cy="45%" r="55%">
                <stop stopColor="#22D3EE" stopOpacity="0.9" />
                <stop offset="0.6" stopColor="#3B82F6" stopOpacity="0.5" />
                <stop offset="1" stopColor="#0B1220" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Stylized brain hemispheres */}
            <path
              d="M100 40 C 60 40, 40 75, 45 110 C 48 135, 65 155, 90 160 L 90 100 Z"
              fill="url(#brain-grad)"
              opacity="0.7"
            />
            <path
              d="M100 40 C 140 40, 160 75, 155 110 C 152 135, 135 155, 110 160 L 110 100 Z"
              fill="url(#brain-grad)"
              opacity="0.7"
            />
            {/* Sulci lines */}
            <path d="M100 50 L 100 155" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" fill="none" />
            <path d="M70 70 C 80 80, 80 100, 75 120" stroke="#3B82F6" strokeOpacity="0.3" strokeWidth="1" fill="none" />
            <path d="M130 70 C 120 80, 120 100, 125 120" stroke="#3B82F6" strokeOpacity="0.3" strokeWidth="1" fill="none" />
            {/* ROI highlight */}
            <circle cx="78" cy="95" r="12" fill="#34D399" fillOpacity="0.25" stroke="#34D399" strokeOpacity="0.6" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Scanning line */}
        <motion.div
          animate={{ top: ["8%", "92%", "8%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]"
        />

        {/* Floating data nodes */}
        {[
          { top: "10%", left: "5%", delay: 0, label: "T1" },
          { top: "80%", left: "8%", delay: 0.5, label: "FLAIR" },
          { top: "15%", left: "85%", delay: 1, label: "T2" },
          { top: "75%", left: "82%", delay: 1.5, label: "DWI" },
        ].map((node) => (
          <motion.div
            key={node.label}
            animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: node.delay, ease: "easeInOut" }}
            className="absolute"
            style={{ top: node.top, left: node.left }}
          >
            <div className="glass rounded-lg px-2 py-1 text-[10px] font-mono font-medium text-cyan-300">
              {node.label}
            </div>
          </motion.div>
        ))}

        {/* Center pulse */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
        />
      </div>
    </div>
  );
}
