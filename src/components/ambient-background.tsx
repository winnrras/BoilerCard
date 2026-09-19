"use client";

import { useEffect, useRef } from "react";

const LEG_SECONDS = 9;

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let start: number | null = null;

    function frame(now: number) {
      if (start === null) start = now;
      const t = (now - start) / 1000;
      const phase = (t / LEG_SECONDS) * Math.PI;
      const x = 6 * Math.sin(phase);
      const y = -4 * Math.sin(phase);
      const scale = 1 + 0.09 * (1 - Math.cos(phase));
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
    // Blur lives on this static, non-animated wrapper. WebKit has a
    // compositing bug where a `position: fixed` element that carries both
    // `filter: blur()` and a JS-driven `transform` can cache the blurred
    // layer and never repaint it. Keeping the transform on an unblurred
    // inner element (still visually blurred, since filter flattens its
    // whole subtree) sidesteps that.
    <div
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: "-20%",
        zIndex: -1,
        overflow: "hidden",
        filter: "blur(60px)",
      }}
    >
      <div
        ref={ref}
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          background:
            "radial-gradient(38% 28% at 18% 22%, rgba(191, 169, 126, 0.12), transparent 60%), radial-gradient(32% 24% at 82% 28%, rgba(148, 140, 121, 0.10), transparent 60%), radial-gradient(42% 32% at 50% 82%, rgba(191, 169, 126, 0.07), transparent 60%)",
        }}
      />
    </div>
  );
}
