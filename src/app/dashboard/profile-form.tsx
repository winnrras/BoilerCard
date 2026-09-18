"use client";

import { useActionState, useState } from "react";
import { HoverButton } from "@/components/motion-primitives";
import { updateProfile, type ProfileFormState } from "./actions";

type Student = {
  name: string;
  avatar_url: string | null;
  major: string | null;
  grad_year: number | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  resume_url: string | null;
  discord: string | null;
};

const initialState: ProfileFormState = { error: null, success: false };

const fieldClass =
  "w-full min-w-0 rounded-md border border-[#948C79]/40 bg-[#121110]/60 px-4 py-2 text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none";
const numberFieldClass = `${fieldClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;
const labelClass = "text-sm text-[#948C79]";

export function ProfileForm({ student }: { student: Student }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );
  const [bioLength, setBioLength] = useState(student.bio?.length ?? 0);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {student.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={student.avatar_url}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
            style={{ width: "4rem", height: "4rem" }}
          />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-full border border-[#948C79]/40 bg-[#121110]/50" />
        )}
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Photo (max 5MB)</span>
          <input
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp"
            className="text-sm text-[#F4F1E8] file:mr-3 file:rounded-md file:border file:border-[#BFA97E] file:bg-transparent file:px-3 file:py-1 file:text-[#BFA97E]"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Name</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={student.name}
          className={fieldClass}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={labelClass}>Major</span>
          <input
            type="text"
            name="major"
            defaultValue={student.major ?? ""}
            className={fieldClass}
          />
        </label>
        <label className="flex w-32 min-w-0 flex-col gap-1">
          <span className={labelClass}>Grad year</span>
          <input
            type="number"
            name="grad_year"
            defaultValue={student.grad_year ?? ""}
            className={numberFieldClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Bio ({bioLength}/140)</span>
        <textarea
          name="bio"
          maxLength={140}
          rows={3}
          defaultValue={student.bio ?? ""}
          onChange={(e) => setBioLength(e.target.value.length)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>LinkedIn URL</span>
        <input
          type="url"
          name="linkedin_url"
          placeholder="https://linkedin.com/in/..."
          defaultValue={student.linkedin_url ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>GitHub URL</span>
        <input
          type="url"
          name="github_url"
          placeholder="https://github.com/..."
          defaultValue={student.github_url ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Discord username</span>
        <input
          type="text"
          name="discord"
          placeholder="username"
          defaultValue={student.discord ?? ""}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Resume (PDF, max 10MB)</span>
        {student.resume_url && (
          <a
            href={student.resume_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#BFA97E] underline"
          >
            Current resume
          </a>
        )}
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          className="text-sm text-[#F4F1E8] file:mr-3 file:rounded-md file:border file:border-[#BFA97E] file:bg-transparent file:px-3 file:py-1 file:text-[#BFA97E]"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-[#BFA97E]">Profile saved.</p>
      )}

      <HoverButton
        type="submit"
        disabled={pending}
        className="rounded-md border border-[#BFA97E] px-4 py-2 text-sm font-medium text-[#BFA97E] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save profile"}
      </HoverButton>
    </form>
  );
}
