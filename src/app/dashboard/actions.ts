"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error: string | null;
  success: boolean;
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in.", success: false };
  }

  const name = String(formData.get("name") ?? "").trim();
  const major = String(formData.get("major") ?? "").trim();
  const gradYearRaw = String(formData.get("grad_year") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedin_url") ?? "").trim();
  const githubUrl = String(formData.get("github_url") ?? "").trim();
  const discord = String(formData.get("discord") ?? "").trim();

  if (!name) {
    return { error: "Name is required.", success: false };
  }
  if (bio.length > 140) {
    return { error: "Bio must be 140 characters or fewer.", success: false };
  }

  let gradYear: number | null = null;
  if (gradYearRaw) {
    gradYear = Number(gradYearRaw);
    if (!Number.isInteger(gradYear) || gradYear < 1900 || gradYear > 2100) {
      return { error: "Enter a valid graduation year.", success: false };
    }
  }

  for (const [label, value] of [
    ["LinkedIn", linkedinUrl],
    ["GitHub", githubUrl],
  ] as const) {
    if (value) {
      try {
        new URL(value);
      } catch {
        return { error: `${label} URL doesn't look valid.`, success: false };
      }
    }
  }

  const update: Record<string, unknown> = {
    name,
    major: major || null,
    grad_year: gradYear,
    bio: bio || null,
    linkedin_url: linkedinUrl || null,
    github_url: githubUrl || null,
    discord: discord || null,
  };

  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return { error: "Avatar image must be under 5MB.", success: false };
    }
    const ext = avatarFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });
    if (uploadError) {
      return {
        error: `Avatar upload failed: ${uploadError.message}`,
        success: false,
      };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    update.avatar_url = `${publicUrl}?v=${Date.now()}`;
  }

  const resumeFile = formData.get("resume");
  if (resumeFile instanceof File && resumeFile.size > 0) {
    if (resumeFile.size > MAX_RESUME_BYTES) {
      return { error: "Resume must be under 10MB.", success: false };
    }
    if (resumeFile.type !== "application/pdf") {
      return { error: "Resume must be a PDF.", success: false };
    }
    const path = `${user.id}/resume.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, resumeFile, { upsert: true });
    if (uploadError) {
      return {
        error: `Resume upload failed: ${uploadError.message}`,
        success: false,
      };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("resumes").getPublicUrl(path);
    update.resume_url = `${publicUrl}?v=${Date.now()}`;
  }

  const { error: updateError } = await supabase
    .from("student")
    .update(update)
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message, success: false };
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}
