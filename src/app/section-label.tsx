"use client";

import { useEffect, useRef } from "react";

const PERIOD_SECONDS = 1.6;

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number;
    let start: number | null = null;

    function frame(now: number) {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      const cycle = (elapsed % PERIOD_SECONDS) / PERIOD_SECONDS;
      const scale = 1 + Math.sin(cycle * Math.PI) * 1.2;
      const opacity = 0.7 * (1 - cycle);
      if (dotRef.current) {
        dotRef.current.style.transform = `scale(${scale})`;
        dotRef.current.style.opacity = String(opacity);
      }
      rafId = requestAnimationFrame(frame);
    }

    // Driven by a raw rAF loop mutating inline styles directly, rather than
    // a CSS animation/transition or the Web Animations API — Safari's
    // system-level "Reduce Motion" setting suppresses both of those even
    // without an explicit prefers-reduced-motion query, but doesn't touch
    // plain per-frame style mutations.
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex items-center gap-3 px-6 sm:px-10">
      <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        <span
          ref={dotRef}
          className="absolute inset-0 rounded-full bg-[#BFA97E]"
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
