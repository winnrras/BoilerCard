"use client";

import { useEffect, useRef } from "react";

const LEG_SECONDS = 26;

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let start: number | null = null;

    function frame(now: number) {
      if (start === null) start = now;
      const t = (now - start) / 1000;
      const phase = (t / LEG_SECONDS) * Math.PI;
      const x = 3 * Math.sin(phase);
      const y = -2 * Math.sin(phase);
      const scale = 1 + 0.03 * (1 - Math.cos(phase));
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
      }
      rafId = requestAnimationFrame(frame);
    }

    // Same reasoning as the section-label pulse: a raw rAF loop mutating
    // inline styles directly, instead of a CSS animation, so it isn't
    // suppressed by Safari's system-level Reduce Motion setting.
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: "-20%",
        zIndex: -1,
        background:
          "radial-gradient(38% 28% at 18% 22%, rgba(191, 169, 126, 0.12), transparent 60%), radial-gradient(32% 24% at 82% 28%, rgba(148, 140, 121, 0.10), transparent 60%), radial-gradient(42% 32% at 50% 82%, rgba(191, 169, 126, 0.07), transparent 60%)",
        filter: "blur(60px)",
      }}
    />
  );
}
