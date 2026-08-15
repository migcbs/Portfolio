import type { NextAuthConfig } from "next-auth";

// Edge-safe config shared by middleware and the full server-side auth.ts.
// No providers here — Credentials (and its Prisma/bcrypt dependencies) are
// only added in auth.ts, which never runs in the Edge middleware bundle.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
};
