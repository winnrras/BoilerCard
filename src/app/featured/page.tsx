import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MotionLink, Reveal } from "@/components/motion-primitives";

const RECENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export default async function FeaturedPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("student")
    .select("slug, name, avatar_url, major, grad_year, created_at")
    .not("avatar_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

  // Server component rendered fresh per request — Date.now() here is fine.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 text-[#F4F1E8] sm:px-10">
      <div>
        <Link href="/" className="text-sm text-[#948C79] hover:text-[#F4F1E8]">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Featured BoilerCards</h1>
        <p className="mt-1 text-sm text-[#948C79]">
          A few students who&apos;ve set up their card.
        </p>
      </div>

      {students && students.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {students.map((student, i) => {
            const isNew =
              now - new Date(student.created_at).getTime() < RECENT_WINDOW_MS;
            const details = [
              student.major,
              student.grad_year ? `'${String(student.grad_year).slice(-2)}` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <Reveal key={student.slug} delay={(i % 12) * 0.05}>
                <MotionLink
                  href={`/u/${student.slug}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group block overflow-hidden rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 hover:border-[#BFA97E]/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {isNew && (
                      <span className="absolute right-2 top-2 z-10 rounded-full bg-[#121110]/80 px-2 py-0.5 text-[10px] font-medium text-[#F4F1E8]">
                        New
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={student.avatar_url!}
                      alt=""
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-[#F4F1E8]">
                      {student.name}
                    </p>
                    {details && (
                      <p className="truncate text-xs text-[#948C79]">
                        {details}
                      </p>
                    )}
                  </div>
                </MotionLink>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="text-[#948C79]">No featured cards yet.</p>
      )}
    </main>
  );
}
