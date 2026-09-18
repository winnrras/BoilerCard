import { createClient } from "@/lib/supabase/server";
import { MotionLink, Reveal } from "@/components/motion-primitives";

export default async function ClubsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clubs } = await supabase
    .from("club")
    .select("slug, name, description, logo_url")
    .order("name");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16 text-[#F4F1E8] sm:px-10">
      <div>
        <MotionLink
          href="/"
          whileHover={{ scale: 1.03 }}
          className="inline-block text-lg font-bold"
        >
          <span className="text-[#BFA97E]">Boiler</span>
          <span className="text-[#F4F1E8]">Card</span>
        </MotionLink>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clubs</h1>
          <p className="mt-1 text-sm text-[#948C79]">
            Opt in to a club&apos;s directory from its page.
          </p>
        </div>
        <MotionLink
          href={user ? "/clubs/new" : "/login"}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-[#2A271F] px-5 py-2 text-sm font-medium text-[#F4F1E8]"
        >
          {user ? "Create a club" : "Sign in to create"}
        </MotionLink>
      </div>

      {clubs && clubs.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {clubs.map((club, i) => (
            <Reveal key={club.slug} delay={(i % 12) * 0.05}>
              <MotionLink
                href={`/clubs/${club.slug}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-5 hover:border-[#BFA97E]/40"
              >
                {club.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={club.logo_url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-[#948C79]/40 object-cover"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                )}
                <div>
                  <p className="font-semibold text-[#F4F1E8]">{club.name}</p>
                  {club.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[#948C79]">
                      {club.description}
                    </p>
                  )}
                </div>
              </MotionLink>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-[#948C79]">No clubs yet.</p>
      )}
    </main>
  );
}
