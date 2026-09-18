"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MembershipState = {
  error: string | null;
  success: boolean;
};

export async function updateMembership(
  clubId: string,
  clubSlug: string,
  _prevState: MembershipState,
  formData: FormData,
): Promise<MembershipState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in.", success: false };
  }

  const visible = formData.get("visible") === "on";
  const role = String(formData.get("role") ?? "").trim();

  const { error } = await supabase
    .from("club_membership")
    .upsert(
      { student_id: user.id, club_id: clubId, visible, role: role || null },
      { onConflict: "student_id,club_id" },
    );

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath(`/clubs/${clubSlug}`);
  return { error: null, success: true };
}

export type ClubEditState = {
  error: string | null;
  success: boolean;
};

const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export async function updateClub(
  clubId: string,
  clubSlug: string,
  _prevState: ClubEditState,
  formData: FormData,
): Promise<ClubEditState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in.", success: false };
  }

  const { data: club } = await supabase
    .from("club")
    .select("created_by")
    .eq("id", clubId)
    .single();

  if (!club || club.created_by !== user.id) {
    return { error: "Only the club creator can do this.", success: false };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const discordUrl = String(formData.get("discord_url") ?? "").trim();
  const boilerlinkUrl = String(formData.get("boilerlink_url") ?? "").trim();

  if (!name) {
    return { error: "Club name is required.", success: false };
  }

  for (const [label, value] of [
    ["Discord", discordUrl],
    ["BoilerLink", boilerlinkUrl],
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
    description: description || null,
    discord_url: discordUrl || null,
    boilerlink_url: boilerlinkUrl || null,
  };

  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > MAX_LOGO_BYTES) {
      return { error: "Logo must be under 5MB.", success: false };
    }
    const ext = logoFile.name.split(".").pop() || "png";
    const path = `${clubId}/logo.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("club-logos")
      .upload(path, logoFile, { upsert: true });
    if (uploadError) {
      return {
        error: `Logo upload failed: ${uploadError.message}`,
        success: false,
      };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("club-logos").getPublicUrl(path);
    update.logo_url = `${publicUrl}?v=${Date.now()}`;
  }

  const documentFile = formData.get("document");
  if (documentFile instanceof File && documentFile.size > 0) {
    if (documentFile.size > MAX_DOCUMENT_BYTES) {
      return { error: "Document must be under 10MB.", success: false };
    }
    if (documentFile.type !== "application/pdf") {
      return { error: "Document must be a PDF.", success: false };
    }
    const path = `${clubId}/document.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("club-documents")
      .upload(path, documentFile, { upsert: true });
    if (uploadError) {
      return {
        error: `Document upload failed: ${uploadError.message}`,
        success: false,
      };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("club-documents").getPublicUrl(path);
    update.document_url = `${publicUrl}?v=${Date.now()}`;
  }

  const { error: updateError } = await supabase
    .from("club")
    .update(update)
    .eq("id", clubId);

  if (updateError) {
    return { error: updateError.message, success: false };
  }

  revalidatePath(`/clubs/${clubSlug}`);
  revalidatePath("/clubs");
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}
