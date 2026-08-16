import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { authConfig } from "@/lib/auth.config";

// A valid bcrypt hash with no known plaintext — compared against on every
// failed lookup so a missing account takes the same time as a wrong
// password, instead of returning early and leaking which emails exist via
// response timing.
const DUMMY_HASH = "$2b$12$NR0hieZbGSuHXGx.CTQujemTHvEcOqFqoeHrgkLtQnpzeaRaEVSF6";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        if (user?.lockedUntil && user.lockedUntil > new Date()) {
          // Still burn the bcrypt cost so a locked account doesn't respond
          // measurably faster than a normal failed attempt.
          await verifyPassword(password, DUMMY_HASH);
          return null;
        }

        const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

        if (!user || !valid) {
          if (user) {
            const attempts = user.failedLoginAttempts + 1;
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: attempts,
                lockedUntil: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null,
              },
            });
          }
          return null;
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
});
