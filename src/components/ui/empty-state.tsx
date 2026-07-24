import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col items-center justify-center py-16 text-center", className)}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-5"
      >
        <div className="absolute inset-0 blur-2xl bg-cyan-500/20 rounded-full" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl glass-strong border border-white/10">
          {icon}
        </div>
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-5">{description}</p>
      {action}
    </motion.div>
  );
}
