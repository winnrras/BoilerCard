import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DiscordMarkIcon, DownloadIcon, ExternalLinkIcon } from "@/components/icons";
import { FadeIn, HoverA, MotionLink, Reveal } from "@/components/motion-primitives";
import { MembershipForm } from "./membership-form";
import { ClubEditForm } from "./club-edit-form";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: club } = await supabase
    .from("club")
    .select(
      "id, name, description, discord_url, boilerlink_url, logo_url, document_url, created_by",
    )
    .eq("slug", slug)
    .single();

  if (!club) {
    notFound();
  }

  const { data: members } = await supabase
    .from("club_membership")
    .select("role, student(slug, name, avatar_url)")
    .eq("club_id", club.id)
    .eq("visible", true);

  // PostgREST returns a single object (not an array) for this many-to-one
  // embed at runtime, even though the inferred type says array — normalize
  // defensively rather than assume either shape.
  const memberEntries = (members ?? []).flatMap((m) => {
    const student = Array.isArray(m.student) ? m.student[0] : m.student;
    return student ? [{ student, role: m.role }] : [];
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let myMembership: { visible: boolean; role: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("club_membership")
      .select("visible, role")
      .eq("club_id", club.id)
      .eq("student_id", user.id)
      .maybeSingle();
    myMembership = data;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16 text-[#F4F1E8] sm:px-10">
      <FadeIn>
        <MotionLink
          href="/clubs"
          whileHover={{ scale: 1.03 }}
          className="inline-block text-sm text-[#948C79] hover:text-[#F4F1E8]"
        >
          ← All clubs
        </MotionLink>

        <div className="mt-2 flex items-center gap-4">
          {club.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={club.logo_url}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
              style={{ width: "3.5rem", height: "3.5rem" }}
            />
          )}
          <h1 className="text-3xl font-bold">{club.name}</h1>
        </div>

        {club.description && (
          <p className="mt-2 max-w-xl text-[#948C79]">{club.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {club.discord_url && (
            <HoverA
              href={club.discord_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#BFA97E] underline"
            >
              <DiscordMarkIcon />
              <span>Discord</span>
            </HoverA>
          )}
          {club.document_url && (
            <HoverA
              href={club.document_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#BFA97E] underline"
            >
              <DownloadIcon />
              <span>Document</span>
            </HoverA>
          )}
          {club.boilerlink_url && (
            <HoverA
              href={club.boilerlink_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#BFA97E] underline"
            >
              <ExternalLinkIcon />
              <span>BoilerLink</span>
            </HoverA>
          )}
        </div>
      </FadeIn>

      {user && (
        <MembershipForm
          clubId={club.id}
          clubSlug={slug}
          initialVisible={myMembership?.visible ?? false}
          initialRole={myMembership?.role ?? ""}
        />
      )}

      {user?.id === club.created_by && (
        <ClubEditForm clubId={club.id} clubSlug={slug} club={club} />
      )}

      <div>
        <h2 className="text-lg font-semibold">Members</h2>
        {memberEntries.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {memberEntries.map(({ student, role }, i) => (
              <Reveal key={student.slug} delay={(i % 12) * 0.05}>
                <MotionLink
                  href={`/u/${student.slug}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#948C79]/20 bg-[#1B1912]/70 p-4 text-center hover:border-[#BFA97E]/40"
                >
                  {student.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.avatar_url}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-full border border-[#948C79]/40 bg-[#121110]/50" />
                  )}
                  <p className="truncate text-sm font-medium">
                    {student.name}
                  </p>
                  {role && (
                    <p className="truncate text-xs text-[#948C79]">{role}</p>
                  )}
                </MotionLink>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[#948C79]">
            No one&apos;s opted in yet.
          </p>
        )}
      </div>
    </main>
  );
}
