"use server";

import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  error: string | null;
  sent: boolean;
};

export async function signInWithEmail(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email.endsWith("@purdue.edu")) {
    return { error: "Use your @purdue.edu email address.", sent: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return { error: error.message, sent: false };
  }

  return { error: null, sent: true };
}
