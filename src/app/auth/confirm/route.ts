import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=invalid-link", request.url));
}

// Without an explicit HEAD handler, Next.js falls back to running GET for
// HEAD requests — which means link-scanning bots (Outlook Safe Links,
// Microsoft Defender) silently consume the single-use OTP token before the
// user ever clicks the link, by sending a HEAD probe first. Respond to HEAD
// with a no-op so probing doesn't burn the token.
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
