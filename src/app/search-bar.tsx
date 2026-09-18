"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { MotionLink } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";

type PersonResult = { slug: string; name: string };
type ClubResult = { slug: string; name: string };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<PersonResult[]>([]);
  const [clubs, setClubs] = useState<ClubResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Nothing to clear synchronously — the dropdown only renders while
      // `query.trim()` is truthy, so stale results just stay unused.
      return;
    }

    const supabase = createClient();
    const timeout = setTimeout(async () => {
      const [{ data: peopleData }, { data: clubData }] = await Promise.all([
        supabase.from("student").select("slug, name").ilike("name", `%${trimmed}%`),
        supabase.from("club").select("slug, name").ilike("name", `%${trimmed}%`),
      ]);
      setPeople(peopleData ?? []);
      setClubs(clubData ?? []);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = people.length > 0 || clubs.length > 0;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search people or clubs…"
        className="w-full rounded-full border border-[#948C79]/40 bg-[#1B1912]/70 px-4 py-2 text-sm text-[#F4F1E8] placeholder:text-[#948C79] backdrop-blur-sm transition focus:border-[#BFA97E] focus:outline-none"
      />

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/95 shadow-2xl shadow-black/40 backdrop-blur-sm"
          >
            {hasResults ? (
              <div className="max-h-80 overflow-y-auto py-2">
                {people.length > 0 && (
                  <div>
                    <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-[#948C79]">
                      People
                    </p>
                    {people.map((p) => (
                      <MotionLink
                        key={p.slug}
                        href={`/u/${p.slug}`}
                        whileHover={{ x: 2 }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#F4F1E8] hover:bg-[#121110]/50"
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="ml-auto shrink-0 text-xs text-[#948C79]">
                          in people
                        </span>
                      </MotionLink>
                    ))}
                  </div>
                )}
                {clubs.length > 0 && (
                  <div>
                    <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-[#948C79]">
                      Clubs
                    </p>
                    {clubs.map((c) => (
                      <MotionLink
                        key={c.slug}
                        href={`/clubs/${c.slug}`}
                        whileHover={{ x: 2 }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#F4F1E8] hover:bg-[#121110]/50"
                      >
                        <span className="truncate">{c.name}</span>
                        <span className="ml-auto shrink-0 text-xs text-[#948C79]">
                          in clubs
                        </span>
                      </MotionLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="px-4 py-3 text-sm text-[#948C79]">No results.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
