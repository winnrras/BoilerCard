"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const segments: { text: string; className?: string }[] = [
  { text: "BoilerCard is your " },
  { text: "student ID", className: "font-bold" },
  { text: ", reimagined as a way to " },
  { text: "⟨connect⟩", className: "font-normal text-[#948C79]" },
  { text: " and " },
  { text: "get found.", className: "font-normal italic text-[#BFA97E]" },
];

type Token = {
  text: string;
  className?: string;
  isSpace: boolean;
  wordIndex: number;
};

function tokenize(): Token[] {
  const tokens: Token[] = [];
  let wordIndex = 0;
  for (const seg of segments) {
    for (const part of seg.text.split(/(\s+)/).filter(Boolean)) {
      const isSpace = /^\s+$/.test(part);
      tokens.push({
        text: part,
        className: seg.className,
        isSpace,
        wordIndex: isSpace ? -1 : wordIndex,
      });
      if (!isSpace) wordIndex += 1;
    }
  }
  return tokens;
}

const tokens = tokenize();

export function HeroHeadline() {
  return (
    <h1 className="max-w-[90vw] pb-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-[#F4F1E8] sm:max-w-[68vw]">
      {tokens.map((token, i) =>
        token.isSpace ? (
          <span key={i}>{token.text}</span>
        ) : (
          <motion.span
            key={i}
            className={`inline-block ${token.className ?? ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: token.wordIndex * 0.07,
              ease: EASE,
            }}
          >
            {token.text}
          </motion.span>
        ),
      )}
    </h1>
  );
}
