import { createClient } from "@/lib/supabase/server";
import { MotionLink } from "@/components/motion-primitives";
import { HeroHeadline } from "./hero-headline";
import { FeaturedThumbnails } from "./featured-thumbnails";
import { FeaturedClubs } from "./featured-clubs";
import { SearchBar } from "./search-bar";
import { NavMenu } from "./nav-menu";
import { SectionLabel } from "./section-label";

const PLACEHOLDER_COUNT = 4;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: featured } = await supabase
    .from("student")
    .select("slug, name, avatar_url")
    .not("avatar_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(PLACEHOLDER_COUNT);

  const slots = Array.from(
    { length: PLACEHOLDER_COUNT },
    (_, i) => featured?.[i] ?? null,
  );

  const { data: clubs } = await supabase
    .from("club")
    .select("slug, name, logo_url")
    .order("created_at", { ascending: false })
    .limit(PLACEHOLDER_COUNT);

  return (
    <div className="flex w-full flex-col">
      <header
        className="grid items-center gap-4 px-6 py-6 sm:px-10"
        style={{ gridTemplateColumns: "auto 1fr auto" }}
      >
        <span className="text-lg font-bold">
          <span className="text-[#BFA97E]">Boiler</span>
          <span className="text-[#F4F1E8]">Card</span>
        </span>

        <div className="mx-auto w-full max-w-xs">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <MotionLink
            href="/clubs"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-[#948C79]/40 px-5 py-2 text-sm font-medium text-[#F4F1E8] hover:border-[#BFA97E] hover:text-[#BFA97E]"
          >
            Clubs
          </MotionLink>
          <NavMenu signedIn={!!user} />
          <MotionLink
            href={user ? "/dashboard" : "/login"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-[#2A271F] px-5 py-2 text-sm font-medium text-[#F4F1E8]"
          >
            {user ? "Dashboard" : "Sign in"}
          </MotionLink>
        </div>
      </header>

      <section className="px-6 pt-2 pb-10 sm:px-10 sm:pt-4">
        <HeroHeadline />
      </section>

      <div className="flex flex-col gap-3 pb-2 sm:gap-4">
        {clubs && clubs.length > 0 && <SectionLabel>Clubs</SectionLabel>}
        <FeaturedClubs clubs={clubs ?? []} />

        <SectionLabel>People</SectionLabel>
        <FeaturedThumbnails slots={slots} />
      </div>
    </div>
  );
}
