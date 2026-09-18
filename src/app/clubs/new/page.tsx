import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FadeIn, MotionLink } from "@/components/motion-primitives";
import { NewClubForm } from "./form";

export default async function NewClubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 py-16">
      <MotionLink
        href="/clubs"
        whileHover={{ scale: 1.03 }}
        className="w-full max-w-sm text-sm text-[#948C79] hover:text-[#F4F1E8]"
      >
        ← All clubs
      </MotionLink>
      <FadeIn className="w-full max-w-sm rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h1 className="text-xl font-semibold text-[#F4F1E8]">
          Create a club
        </h1>
        <p className="mt-1 text-sm text-[#948C79]">
          A public page for your club — students opt in themselves.
        </p>
        <NewClubForm />
      </FadeIn>
    </main>
  );
}
