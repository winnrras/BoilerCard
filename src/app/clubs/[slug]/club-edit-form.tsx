"use client";

import { useActionState } from "react";
import { HoverButton } from "@/components/motion-primitives";
import { updateClub, type ClubEditState } from "./actions";

const initialState: ClubEditState = { error: null, success: false };

const fieldClass =
  "w-full min-w-0 rounded-md border border-[#948C79]/40 bg-[#1B1912] px-3 py-1.5 text-sm text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none";
const labelClass = "text-sm text-[#948C79]";

type Club = {
  name: string;
  description: string | null;
  discord_url: string | null;
  boilerlink_url: string | null;
  logo_url: string | null;
  document_url: string | null;
};

export function ClubEditForm({
  clubId,
  clubSlug,
  club,
}: {
  clubId: string;
  clubSlug: string;
  club: Club;
}) {
  const boundAction = updateClub.bind(null, clubId, clubSlug);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-[#948C79]/20 bg-[#121110]/50 p-4"
    >
      <p className="text-sm text-[#948C79]">
        Edit club (visible only to you, since you created this club)
      </p>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Name</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={club.name}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Description</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={club.description ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Discord URL</span>
        <input
          type="url"
          name="discord_url"
          defaultValue={club.discord_url ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>BoilerLink URL</span>
        <input
          type="url"
          name="boilerlink_url"
          defaultValue={club.boilerlink_url ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Logo (max 5MB)</span>
        {club.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.logo_url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
            style={{ width: "3rem", height: "3rem" }}
          />
        )}
        <input
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/webp"
          className="text-sm text-[#F4F1E8] file:mr-3 file:rounded-md file:border file:border-[#BFA97E] file:bg-transparent file:px-3 file:py-1 file:text-[#BFA97E]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Document (PDF, max 10MB)</span>
        {club.document_url && (
          <a
            href={club.document_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#BFA97E] underline"
          >
            Current document
          </a>
        )}
        <input
          type="file"
          name="document"
          accept="application/pdf"
          className="text-sm text-[#F4F1E8] file:mr-3 file:rounded-md file:border file:border-[#BFA97E] file:bg-transparent file:px-3 file:py-1 file:text-[#BFA97E]"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-[#BFA97E]">Saved.</p>}

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
