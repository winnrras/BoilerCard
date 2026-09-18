"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreateClubState = {
  error: string | null;
};

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
) {
  let slug = base;
  for (let attempt = 1; attempt <= 20; attempt++) {
    const { data } = await supabase
      .from("club")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${attempt}`;
  }
  return `${base}-${Date.now()}`;
}

export async function createClub(
  _prevState: CreateClubState,
  formData: FormData,
): Promise<CreateClubState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const discordUrl = String(formData.get("discord_url") ?? "").trim();
  const boilerlinkUrl = String(formData.get("boilerlink_url") ?? "").trim();

  if (!name) {
    return { error: "Club name is required." };
  }

  for (const [label, value] of [
    ["Discord", discordUrl],
    ["BoilerLink", boilerlinkUrl],
  ] as const) {
    if (value) {
      try {
        new URL(value);
      } catch {
        return { error: `${label} URL doesn't look valid.` };
      }
    }
  }

  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "club";
  const slug = await uniqueSlug(supabase, base);

  const { error } = await supabase.from("club").insert({
    name,
    slug,
    description: description || null,
    discord_url: discordUrl || null,
    boilerlink_url: boilerlinkUrl || null,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/clubs/${slug}`);
}
