"use client";

import { useActionState, useState } from "react";
import { FadeIn, HoverButton } from "@/components/motion-primitives";
import { signIn, signUp, type AuthState } from "./actions";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-16">
      <FadeIn className="w-full max-w-sm rounded-2xl border border-[#948C79]/20 bg-[#1B1912]/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">
          <span className="text-[#BFA97E]">Boiler</span>
          <span className="text-[#F4F1E8]">Card</span>
        </h1>
        <p className="mt-2 text-sm text-[#948C79]">
          {mode === "signin"
            ? "Sign in with your Purdue email."
            : "Create your account with your Purdue email."}
        </p>

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
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="Password (min. 8 characters)"
            className="rounded-md border border-[#948C79]/40 bg-[#121110]/60 px-4 py-2 text-[#F4F1E8] placeholder:text-[#948C79] transition focus:border-[#BFA97E] focus:outline-none"
          />
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <HoverButton
            type="submit"
            disabled={pending}
            className="rounded-md border border-[#BFA97E] px-4 py-2 text-sm font-medium text-[#BFA97E] disabled:opacity-50"
          >
            {pending
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </HoverButton>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-[#948C79] underline hover:text-[#F4F1E8]"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </FadeIn>
    </main>
  );
}
