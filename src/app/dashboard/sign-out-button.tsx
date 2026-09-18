"use client";

import { HoverButton } from "@/components/motion-primitives";

export function SignOutButton() {
  return (
    <HoverButton
      type="submit"
      className="text-sm text-[#948C79] underline hover:text-[#F4F1E8]"
    >
      Sign out
    </HoverButton>
  );
}
