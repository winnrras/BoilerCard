import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { FadeIn, HoverA, MotionLink } from "@/components/motion-primitives";
import { signOut } from "../auth/actions";
import { ProfileForm } from "./profile-form";
import { SignOutButton } from "./sign-out-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: student } = await supabase
    .from("student")
    .select(
      "name, avatar_url, major, grad_year, bio, linkedin_url, github_url, resume_url, discord, slug",
    )
    .eq("id", user.id)
    .single();

  if (!student) {
    redirect("/login");
  }

  const { data: memberships } = await supabase
    .from("club_membership")
    .select("visible, club(name, slug, logo_url)")
    .eq("student_id", user.id);

  // PostgREST returns a single object (not an array) for this many-to-one
  // embed at runtime, even though the inferred type says array.
  const myClubs = (memberships ?? []).flatMap((m) => {
    const club = Array.isArray(m.club) ? m.club[0] : m.club;
    return club ? [{ club, visible: m.visible }] : [];
  });

  const siteUrl = await getSiteUrl();
  const profileUrl = `${siteUrl}/u/${student.slug}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    margin: 1,
    width: 240,
    color: { dark: "#121110", light: "#F4F1E8" },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-16 text-[#F4F1E8]">
      <MotionLink
        href="/"
        whileHover={{ scale: 1.03 }}
        className="mb-4 inline-block self-start text-lg font-bold"
      >
        <span className="text-[#BFA97E]">Boiler</span>
        <span className="text-[#F4F1E8]">Card</span>
      </MotionLink>

      <FadeIn className="flex flex-col gap-6 rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Your BoilerCard</h1>
          <div className="flex items-center gap-4">
            <MotionLink
              href="/clubs"
              whileHover={{ scale: 1.03 }}
              className="text-sm text-[#948C79] hover:text-[#F4F1E8]"
            >
              Clubs
            </MotionLink>
            <form action={signOut}>
              <SignOutButton />
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#948C79]/20 bg-[#121110]/50 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="QR code linking to your public profile"
            className="h-40 w-40 rounded"
          />
          <HoverA
            href={`/u/${student.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#BFA97E] underline"
          >
            {profileUrl}
          </HoverA>
        </div>

        <ProfileForm student={student} />

        {myClubs.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#948C79]">Your clubs</h2>
            <div className="mt-2 flex flex-col gap-2">
              {myClubs.map(({ club, visible }) => (
                <MotionLink
                  key={club.slug}
                  href={`/clubs/${club.slug}`}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-3 rounded-xl border border-[#948C79]/20 bg-[#121110]/50 p-3 hover:border-[#BFA97E]/40"
                >
                  {club.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={club.logo_url}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                  ) : (
                    <div className="h-8 w-8 shrink-0 rounded-full border border-[#948C79]/40 bg-[#1B1912]" />
                  )}
                  <span className="flex-1 truncate text-sm text-[#F4F1E8]">
                    {club.name}
                  </span>
                  <span className="shrink-0 text-xs text-[#948C79]">
                    {visible ? "Visible" : "Hidden"}
                  </span>
                </MotionLink>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
