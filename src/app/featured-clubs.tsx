"use client";

import { GroupIcon } from "@/components/icons";
import { MotionLink } from "@/components/motion-primitives";

type FeaturedClub = {
  slug: string;
  name: string;
  logo_url: string | null;
};

export function FeaturedClubs({ clubs }: { clubs: FeaturedClub[] }) {
  if (clubs.length === 0) return null;

  return (
    <section className="grid grid-cols-2 gap-3 px-6 sm:grid-cols-4 sm:gap-4 sm:px-10">
      {clubs.map((club) => (
        <MotionLink
          key={club.slug}
          href={`/clubs/${club.slug}`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="group relative h-40 overflow-hidden rounded-t-2xl border border-[#948C79]/20 bg-[#1B1912] sm:h-48"
        >
          <span className="absolute right-2 top-2 z-10 rounded-full bg-[#121110]/80 px-2 py-0.5 text-[10px] font-medium text-[#F4F1E8]">
            New
          </span>
          {club.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={club.logo_url}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#948C79]">
              <GroupIcon width={32} height={32} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-[#121110] via-[#121110]/70 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
            <p className="truncate text-sm font-semibold text-[#F4F1E8]">
              {club.name}
            </p>
            <p className="truncate text-xs text-[#BFA97E]">
              Take me to this club →
            </p>
          </div>
        </MotionLink>
      ))}
    </section>
  );
}
