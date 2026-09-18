"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, PlusIcon } from "@/components/icons";
import { MotionLink } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";

export function NavMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#948C79]/40 text-[#F4F1E8] transition hover:border-[#BFA97E]"
      >
        <MenuIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ width: "max-content" }}
            className="absolute right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#948C79]/20 bg-[#1B1912]/95 py-1 shadow-2xl shadow-black/40 backdrop-blur-sm"
          >
            <MotionLink
              href={signedIn ? "/clubs/new" : "/login"}
              whileHover={{ x: 2 }}
              onClick={() => setOpen(false)}
              style={{ whiteSpace: "nowrap" }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#F4F1E8] hover:bg-[#121110]/50"
            >
              <PlusIcon className="shrink-0" />
              <span>Create a club</span>
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
