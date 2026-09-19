"use client";

import { motion } from "framer-motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-6 sm:px-10">
      <motion.span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#BFA97E]"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-[#948C79]">
        {children}
      </p>
      <span className="h-px flex-1 bg-[#948C79]/20" />
    </div>
  );
}
