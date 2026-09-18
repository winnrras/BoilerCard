"use client";

import { useState } from "react";
import { CopyIcon, DiscordMarkIcon } from "@/components/icons";
import { HoverButton } from "@/components/motion-primitives";

export function CopyDiscordButton({ discord }: { discord: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(discord);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — no-op.
    }
  }

  return (
    <HoverButton
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-full border border-[#948C79]/30 px-3 py-1.5 text-sm text-[#F4F1E8] hover:border-[#BFA97E] hover:text-[#BFA97E]"
    >
      <DiscordMarkIcon />
      <span>{copied ? "Copied!" : discord}</span>
      {!copied && <CopyIcon className="opacity-60" />}
    </HoverButton>
  );
}
