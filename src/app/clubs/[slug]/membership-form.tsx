"use client";

import { useActionState } from "react";
import { HoverButton } from "@/components/motion-primitives";
import { updateMembership, type MembershipState } from "./actions";

const initialState: MembershipState = { error: null, success: false };

export function MembershipForm({
  clubId,
  clubSlug,
  initialVisible,
  initialRole,
}: {
  clubId: string;
  clubSlug: string;
  initialVisible: boolean;
  initialRole: string;
}) {
  const boundAction = updateMembership.bind(null, clubId, clubSlug);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-[#948C79]/20 bg-[#121110]/50 p-4"
    >
      <label className="flex items-center gap-2 text-sm text-[#F4F1E8]">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={initialVisible}
          className="h-4 w-4 accent-[#BFA97E]"
        />
        Show me on this club&apos;s page
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-[#948C79]">Role (optional)</span>
        <input
          type="text"
          name="role"
          placeholder="e.g. officer"
          defaultValue={initialRole}
          className="rounded-md border border-[#948C79]/40 bg-[#1B1912] px-3 py-1.5 text-sm text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-[#BFA97E]">Saved.</p>
      )}

      <HoverButton
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-[#BFA97E] px-4 py-1.5 text-sm font-medium text-[#BFA97E] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </HoverButton>
    </form>
  );
}
