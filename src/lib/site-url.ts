import { headers } from "next/headers";

export async function getSiteUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}
