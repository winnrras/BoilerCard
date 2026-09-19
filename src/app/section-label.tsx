"use client";

import { motion } from "framer-motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-6 sm:px-10">
      <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[#BFA97E]"
          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#BFA97E]" />
      </span>
      <p className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-[#948C79]">
        {children}
      </p>
      <span className="h-px flex-1 bg-[#948C79]/20" />
    </div>
  );
}
