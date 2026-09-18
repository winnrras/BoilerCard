"use client";

import { MotionLink } from "@/components/motion-primitives";

type FeaturedStudent = { slug: string; name: string; avatar_url: string } | null;

export function FeaturedThumbnails({ slots }: { slots: FeaturedStudent[] }) {
  return (
    <section className="grid grid-cols-2 gap-3 px-6 pb-0 sm:grid-cols-4 sm:gap-4 sm:px-10">
      {slots.map((student, i) => (
        <MotionLink
          key={student?.slug ?? `placeholder-${i}`}
          href={student ? `/u/${student.slug}` : "/featured"}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="group relative h-72 overflow-hidden rounded-t-2xl border border-[#948C79]/20 bg-[#1B1912] sm:h-80"
        >
          <span className="absolute right-2 top-2 z-10 rounded-full bg-[#121110]/80 px-2 py-0.5 text-[10px] font-medium text-[#F4F1E8]">
            New
          </span>
          {student?.avatar_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.avatar_url}
                alt=""
                className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-[#121110] via-[#121110]/70 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                <p className="truncate text-sm font-semibold text-[#F4F1E8]">
                  {student.name}
                </p>
                <p className="truncate text-xs text-[#BFA97E]">
                  Take me to this profile →
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#948C79]">
              <PersonPlaceholderIcon />
            </div>
          )}
        </MotionLink>
      ))}
    </section>
  );
}

function PersonPlaceholderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="opacity-40"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}
