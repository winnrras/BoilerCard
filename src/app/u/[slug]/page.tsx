import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DownloadIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { FadeIn, HoverA, MotionLink, Reveal } from "@/components/motion-primitives";
import { CopyDiscordButton } from "./copy-discord-button";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("student")
    .select(
      "id, name, avatar_url, major, grad_year, bio, linkedin_url, github_url, resume_url, discord",
    )
    .eq("slug", slug)
    .single();

  if (!student) {
    notFound();
  }

  const { data: memberships } = await supabase
    .from("club_membership")
    .select("club(name, slug)")
    .eq("student_id", student.id)
    .eq("visible", true);

  const clubs = (memberships ?? []).flatMap((m) => m.club);

  const details = [
    student.major,
    student.grad_year ? `Class of ${student.grad_year}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const linkChipClass =
    "flex items-center gap-2 rounded-full border border-[#948C79]/30 px-3 py-1.5 text-sm text-[#F4F1E8] hover:border-[#BFA97E] hover:text-[#BFA97E]";

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 py-16">
      <MotionLink
        href="/"
        whileHover={{ scale: 1.03 }}
        className="w-full max-w-sm text-sm text-[#948C79] hover:text-[#F4F1E8]"
      >
        ← BoilerCard
      </MotionLink>

      <FadeIn className="w-full max-w-sm rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-sm">
        {student.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={student.avatar_url}
            alt=""
            width={80}
            height={80}
            className="mx-auto h-20 w-20 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
            style={{ width: "5rem", height: "5rem" }}
          />
        )}

        <h1 className="mt-4 text-2xl font-bold text-[#F4F1E8]">
          {student.name}
        </h1>

        {details && <p className="mt-1 text-sm text-[#948C79]">{details}</p>}

        {student.bio && (
          <p className="mx-auto mt-4 max-w-xs text-sm text-[#F4F1E8]">
            {student.bio}
          </p>
        )}

        {(student.linkedin_url ||
          student.github_url ||
          student.discord ||
          student.resume_url) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {student.linkedin_url && (
              <HoverA
                href={student.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className={linkChipClass}
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </HoverA>
            )}
            {student.github_url && (
              <HoverA
                href={student.github_url}
                target="_blank"
                rel="noreferrer"
                className={linkChipClass}
              >
                <GitHubIcon />
                <span>GitHub</span>
              </HoverA>
            )}
            {student.discord && <CopyDiscordButton discord={student.discord} />}
            {student.resume_url && (
              <HoverA
                href={student.resume_url}
                target="_blank"
                rel="noreferrer"
                className={linkChipClass}
              >
                <DownloadIcon />
                <span>Resume</span>
              </HoverA>
            )}
          </div>
        )}

        {clubs.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2 border-t border-[#948C79]/15 pt-6">
            {clubs.map((club, i) => (
              <Reveal key={club.slug} delay={i * 0.06} className="inline-block">
                <span className="rounded-full border border-[#BFA97E]/40 px-3 py-1 text-xs text-[#BFA97E]">
                  {club.name}
                </span>
              </Reveal>
            ))}
          </div>
        )}
      </FadeIn>
    </main>
  );
}
