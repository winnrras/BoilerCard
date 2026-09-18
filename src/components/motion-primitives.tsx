"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { ComponentProps } from "react";
import { EASE } from "@/lib/motion";

export const MotionLink = motion.create(Link);

export const hoverProps = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: EASE },
};

export function HoverButton(props: ComponentProps<typeof motion.button>) {
  return <motion.button {...hoverProps} {...props} />;
}

export function HoverA(props: ComponentProps<typeof motion.a>) {
  return <motion.a {...hoverProps} {...props} />;
}

/** Fades a section up into place once, right on mount (page-load reveal). */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Fades a section up into place once, when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
