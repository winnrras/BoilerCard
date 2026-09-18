import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Never cache this route — it mutates cookies based on a one-time token in
// the query string, and a cached response would strip the Set-Cookie header
// entirely (or serve a stale redirect to a different visitor).
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    // Build the redirect response up front and thread it through the cookie
    // handlers (the same pattern our proxy uses), rather than relying on
    // `next/headers` cookies() to implicitly attach to a response we
    // construct separately — that worked in local dev but the session
    // cookie wasn't reliably reaching the browser on Vercel's runtime.
    let response = NextResponse.redirect(new URL(next, request.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.redirect(new URL(next, request.url));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return response;
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
