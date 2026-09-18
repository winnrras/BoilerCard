"use client";

import { useActionState } from "react";
import { FadeIn, HoverButton } from "@/components/motion-primitives";
import { signInWithEmail, type SignInState } from "./actions";

const initialState: SignInState = { error: null, sent: false };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithEmail,
    initialState,
  );

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-16">
      <FadeIn className="w-full max-w-sm rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">
          <span className="text-[#BFA97E]">Boiler</span>
          <span className="text-[#F4F1E8]">Card</span>
        </h1>
        <p className="mt-2 text-sm text-[#948C79]">
          Sign in with your Purdue email to get your card.
        </p>

        {state.sent ? (
          <p className="mt-6 rounded-md border border-[#BFA97E]/30 bg-[#121110]/60 px-4 py-3 text-sm text-[#F4F1E8]">
            Check your Purdue inbox for a sign-in link.
          </p>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="name@purdue.edu"
              pattern=".+@purdue\.edu"
              title="Use your @purdue.edu email address"
              className="rounded-md border border-[#948C79]/40 bg-[#121110]/60 px-4 py-2 text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none"
            />
            {state.error && (
              <p className="text-sm text-red-400">{state.error}</p>
            )}
            <HoverButton
              type="submit"
              disabled={pending}
              className="rounded-md border border-[#BFA97E] px-4 py-2 text-sm font-medium text-[#BFA97E] disabled:opacity-50"
            >
              {pending ? "Sending…" : "Send magic link"}
            </HoverButton>
          </form>
        )}
      </FadeIn>
    </main>
  );
}
