"use client";

import { useActionState } from "react";
import { HoverButton } from "@/components/motion-primitives";
import { createClub, type CreateClubState } from "./actions";

const initialState: CreateClubState = { error: null };

const fieldClass =
  "rounded-md border border-[#948C79]/40 bg-[#121110]/60 px-4 py-2 text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none";
const labelClass = "text-sm text-[#948C79]";

export function NewClubForm() {
  const [state, formAction, pending] = useActionState(
    createClub,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className={labelClass}>Club name</span>
        <input type="text" name="name" required className={fieldClass} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Description</span>
        <textarea name="description" rows={3} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Discord URL</span>
        <input
          type="url"
          name="discord_url"
          placeholder="https://discord.gg/..."
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>BoilerLink URL</span>
        <input
          type="url"
          name="boilerlink_url"
          placeholder="https://boilerlink.purdue.edu/organization/..."
          className={fieldClass}
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <HoverButton
        type="submit"
        disabled={pending}
        className="rounded-md border border-[#BFA97E] px-4 py-2 text-sm font-medium text-[#BFA97E] disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create club"}
      </HoverButton>
    </form>
  );
}
