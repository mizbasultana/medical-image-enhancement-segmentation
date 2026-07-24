import { motion } from "framer-motion";

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] right-[5%] h-[350px] w-[350px] rounded-full bg-blue-500/6 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[5%] left-[30%] h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[90px]"
      />
    </div>
  );
}

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-grid-pattern opacity-30 mask-radial" />
  );
}
