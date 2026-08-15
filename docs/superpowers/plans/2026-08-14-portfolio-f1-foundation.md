# Portafolio F1 — Fundación: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the full Next.js + Prisma + Auth.js foundation for the portfolio site (public pages with placeholder/seeded content + a working hidden admin login), running entirely local, ready to point at Neon + Vercel Blob for deploy.

**Architecture:** Single Next.js 15 (App Router, TypeScript) project. Tailwind CSS implements the cinematic design system (`liquid-glass`, `blurFadeUp`, Inter) as reusable global classes. Prisma (PostgreSQL) holds all content models. Auth.js (Credentials) gates `/admin/*` via middleware. Server Components read content directly via Prisma; the admin login is the only interactive auth flow in this phase.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL (local via Docker for this build; Neon-compatible connection string), Auth.js (next-auth v5), bcryptjs, Docker Compose (local Postgres only).

## Global Constraints

- Design system verbatim from spec: pure black background, `.liquid-glass` class (rgba(255,255,255,0.01) bg, backdrop-blur(4px), inset shadow, gradient-stroke `::before`), `@keyframes blurFadeUp` (opacity 0→1, blur(20px)→0, translateY(40px)→0, 1s ease-out), Inter font (weights 300-700).
- Brand names are data, not hardcoded strings: `SiteSettings.portfolioBrand` = "Miguel Ceballos — Portafolio", `SiteSettings.agencyBrand` = "ATENU BrandHouse" (seeded defaults, editable in F2).
- Admin routes live under `/admin` and are **not** linked from public navigation.
- No automated test suite in F1 (explicitly out of scope per spec) — each task's verification step is a manual/CLI check (build passes, command output, browser check) instead of unit tests.
- Schema targets PostgreSQL only (Neon-compatible) — no SQLite.
- Deviation from spec's "Neon dev branch" for local dev: this plan uses a local Postgres via Docker Compose instead, since implementation can't obtain the user's Neon credentials mid-build. Same engine, same schema, zero code changes needed to swap `DATABASE_URL` to a real Neon string later — documented in README (Task 10).

---

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.eslintrc.json`

**Interfaces:**
- Produces: project skeleton at repo root; `src/app/` as the App Router root; Tailwind available to all subsequent tasks.

- [ ] **Step 1: Scaffold with create-next-app**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
```

Answer "Yes" to overwrite if prompted (empty dir except README/docs). This generates `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.

- [ ] **Step 2: Verify dev server boots**

Run: `npm run build`
Expected: build completes with no errors, prints route `/` as static.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript and Tailwind"
```

---

### Task 2: Design system — liquid-glass, blurFadeUp, Inter

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: global CSS classes `.liquid-glass` and `.animate-blur-fade-up` (with inline `animationDelay` support), Inter font applied to `body`, usable by every component in later tasks.

- [ ] **Step 1: Add Inter font in layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Miguel Ceballos — Portafolio",
  description: "Desarrollo web y soluciones digitales — ATENU BrandHouse",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Add liquid-glass and blurFadeUp to globals.css**

Append to `src/app/globals.css` (keep the existing Tailwind `@tailwind` directives at top):

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

@keyframes blurFadeUp {
  from {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

.animate-blur-fade-up {
  opacity: 0;
  animation: blurFadeUp 1s ease-out forwards;
}

.bottom-blur-mask {
  -webkit-mask-image: linear-gradient(to top, black 0%, transparent 45%);
  mask-image: linear-gradient(to top, black 0%, transparent 45%);
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, open `http://localhost:3000`, confirm the page loads black background with Inter font (check DevTools computed font-family shows "Inter").

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add liquid-glass and blurFadeUp design system"
```

---

### Task 3: Local Postgres via Docker Compose

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.env` (gitignored, local only)

**Interfaces:**
- Produces: a running Postgres instance at `postgresql://portfolio:portfolio@localhost:5432/portfolio`, consumed by Task 4's Prisma setup.

- [ ] **Step 1: Write docker-compose.yml**

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
      POSTGRES_DB: portfolio
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

- [ ] **Step 2: Write .env.example**

```bash
# Local Postgres (docker-compose) — swap for a Neon connection string when deploying
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio"

# Auth.js
AUTH_SECRET="generate-with-npx-auth-secret"

# Seeded admin login (used by prisma/seed.ts)
ADMIN_EMAIL="miguelcq13@gmail.com"
ADMIN_PASSWORD="change-me-locally"

# Vercel Blob (leave empty locally — uploads disabled until set, required for F3/deploy)
BLOB_READ_WRITE_TOKEN=""
```

- [ ] **Step 3: Copy to real .env and start Postgres**

```bash
cp .env.example .env
npx auth secret --raw
```

Paste the generated value into `AUTH_SECRET` in `.env`. Then:

```bash
docker compose up -d
docker compose ps
```

Expected: `db` service shows `running (healthy)` or `Up`.

- [ ] **Step 4: Confirm .env is gitignored, commit compose file**

Check `.gitignore` already contains `.env` (create-next-app adds it by default) — if not, append `.env`.

```bash
git add docker-compose.yml .env.example .gitignore
git commit -m "chore: add local Postgres via docker-compose"
```

---

### Task 4: Prisma schema and client

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`
- Modify: `package.json` (add `prisma`, `@prisma/client` deps + `postinstall` script)

**Interfaces:**
- Produces: `prisma` singleton export from `src/lib/prisma.ts` (`import { prisma } from "@/lib/prisma"`), and all Prisma models used by every later task (`User`, `SiteSettings`, `Client`, `Story`, `PortfolioProject`, `Service`, `Review`, `Lead`, `SocialLink`).

- [ ] **Step 1: Install Prisma**

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env` (already set from Task 3 — leave as is).

- [ ] **Step 2: Write the full schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model SiteSettings {
  id              String   @id @default(cuid())
  portfolioBrand  String   @default("Miguel Ceballos — Portafolio")
  agencyBrand     String   @default("ATENU BrandHouse")
  heroTitle       String   @default("Step Through. Work Smarter.")
  heroDescription String   @default("Desarrollo web y soluciones digitales para tu marca.")
  heroVideoUrl    String?
  heroImageUrl    String?
  aboutText       String   @default("")
  contactEmail    String   @default("")
  updatedAt       DateTime @updatedAt
}

model Client {
  id        String   @id @default(cuid())
  name      String
  logoUrl   String?
  website   String?
  active    Boolean  @default(true)
  order     Int      @default(0)
  stories   Story[]
  createdAt DateTime @default(now())
}

enum StoryType {
  IMAGE
  VIDEO
}

model Story {
  id        String    @id @default(cuid())
  clientId  String
  client    Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  type      StoryType @default(IMAGE)
  mediaUrl  String
  order     Int       @default(0)
  active    Boolean   @default(true)
  createdAt DateTime  @default(now())
}

model PortfolioProject {
  id          String   @id @default(cuid())
  title       String
  description String
  imageUrl    String?
  projectUrl  String?
  tags        String[]
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Service {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Decimal? @db.Decimal(10, 2)
  features    String[]
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Review {
  id         String   @id @default(cuid())
  authorName String
  text       String
  rating     Int      @default(5)
  approved   Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Lead {
  id                String   @id @default(cuid())
  name              String
  email             String
  message           String
  interestedPackage String?
  read              Boolean  @default(false)
  createdAt         DateTime @default(now())
}

enum SocialScope {
  PERSONAL
  AGENCY
}

model SocialLink {
  id        String      @id @default(cuid())
  label     String
  url       String
  scope     SocialScope @default(PERSONAL)
  order     Int         @default(0)
  createdAt DateTime    @default(now())
}
```

- [ ] **Step 3: Prisma client singleton**

```ts
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Run migration against local Postgres**

```bash
npx prisma migrate dev --name init
```

Expected: output ends with "Your database is now in sync with your schema" and generates `prisma/migrations/<timestamp>_init/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Prisma schema and client singleton"
```

---

### Task 5: Password helper and seed script

**Files:**
- Create: `src/lib/password.ts`
- Create: `prisma/seed.ts`
- Modify: `package.json` (add `bcryptjs`, `tsx`, `prisma.seed` config)

**Interfaces:**
- Produces: `hashPassword(plain: string): Promise<string>` and `verifyPassword(plain: string, hash: string): Promise<boolean>` from `src/lib/password.ts`, consumed by Task 5's seed and Task 7's Auth.js config.

- [ ] **Step 1: Install deps**

```bash
npm install bcryptjs
npm install -D tsx @types/bcryptjs
```

- [ ] **Step 2: Write password helper**

```ts
// src/lib/password.ts
import bcrypt from "bcryptjs";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

- [ ] **Step 3: Write seed script**

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "miguelcq13@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-locally";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: await hashPassword(adminPassword) },
  });

  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({ data: {} });
  }

  const client = await prisma.client.upsert({
    where: { id: "seed-client-1" },
    update: {},
    create: {
      id: "seed-client-1",
      name: "Cliente Demo",
      website: "https://example.com",
      order: 0,
    },
  });

  await prisma.story.upsert({
    where: { id: "seed-story-1" },
    update: {},
    create: {
      id: "seed-story-1",
      clientId: client.id,
      type: "IMAGE",
      mediaUrl: "https://placehold.co/720x1280/000000/FFFFFF?text=Story+Demo",
      order: 0,
    },
  });

  await prisma.portfolioProject.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "Proyecto Demo",
      description: "Sitio web desarrollado a la medida.",
      projectUrl: "https://example.com",
      tags: ["Next.js", "Diseño Web"],
      order: 0,
    },
  });

  await prisma.service.upsert({
    where: { id: "seed-package-1" },
    update: {},
    create: {
      id: "seed-package-1",
      name: "Paquete Esencial",
      description: "Sitio web de una página, optimizado y responsivo.",
      price: 8000,
      features: ["Diseño a medida", "Hosting incluido 1 año", "Soporte 30 días"],
      order: 0,
    },
  });

  await prisma.review.upsert({
    where: { id: "seed-review-1" },
    update: {},
    create: {
      id: "seed-review-1",
      authorName: "Cliente Satisfecho",
      text: "Excelente trabajo, entrega puntual y gran comunicación.",
      rating: 5,
      approved: true,
    },
  });

  console.log("Seed completado. Admin:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 4: Wire seed command in package.json**

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 5: Run and verify seed**

```bash
npx prisma db seed
npx prisma studio
```

Expected: console prints "Seed completado. Admin: miguelcq13@gmail.com"; Prisma Studio (opens in browser) shows 1 row in `User`, `SiteSettings`, `Client`, `Story`, `PortfolioProject`, `Service`, `Review`. Close Studio (Ctrl+C) after checking.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add password helper and database seed script"
```

---

### Task 6: Auth.js credentials login + middleware

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/middleware.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/actions.ts`

**Interfaces:**
- Consumes: `prisma` from `src/lib/prisma.ts`, `verifyPassword` from `src/lib/password.ts`.
- Produces: `auth()`, `signIn`, `signOut` exports from `src/lib/auth.ts`, used by Task 8's admin layout and any future protected server actions.

- [ ] **Step 1: Install next-auth v5**

```bash
npm install next-auth@beta
```

- [ ] **Step 2: Auth config**

```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
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
        if (!user) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
});
```

- [ ] **Step 3: Route handler**

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 4: Middleware protecting /admin**

```ts
// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = { matcher: ["/admin/:path*"] };
```

- [ ] **Step 5: Login server action**

```ts
// src/app/admin/login/actions.ts
"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Credenciales inválidas.";
    }
    throw error;
  }
}
```

- [ ] **Step 6: Login page**

```tsx
// src/app/admin/login/page.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        action={formAction}
        className="liquid-glass rounded-2xl p-8 w-full max-w-sm animate-blur-fade-up"
      >
        <h1 className="text-2xl font-medium mb-6">Acceso admin</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full mb-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          className="w-full mb-4 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black rounded-full font-medium py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 7: Verify login flow manually**

```bash
npm run dev
```

Open `http://localhost:3000/admin` → confirm redirect to `/admin/login`. Log in with `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env` (seeded in Task 5) → confirm redirect to `/admin` (will 404 until Task 8 — a 404 with URL `/admin` still confirms the auth redirect worked; note it and continue).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Auth.js credentials login and admin route protection"
```

---

### Task 7: Public layout — Navbar, mobile menu, footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `prisma` (reads `SiteSettings.portfolioBrand` for the logo text).
- Produces: `<Navbar />` and `<Footer />` composed into the root layout, wrapping every public page created in Task 8/9.

- [ ] **Step 1: Navbar component**

```tsx
// src/components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "/portafolio", label: "Portafolio" },
  { href: "/agencia", label: "Agencia" },
  { href: "/paquetes", label: "Paquetes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 md:py-6">
        <Link
          href="/"
          className="text-base md:text-lg font-semibold tracking-tight animate-blur-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          {brand}
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-300 transition-colors animate-blur-fade-up"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contacto"
            className="hidden sm:flex liquid-glass rounded-full px-4 md:px-6 py-2 items-center gap-2 text-sm animate-blur-fade-up"
            style={{ animationDelay: "350ms" }}
          >
            <Search size={18} />
            Buscar
          </Link>
          <div
            className="hidden sm:flex liquid-glass w-10 h-10 rounded-full items-center justify-center animate-blur-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <User size={18} />
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden liquid-glass w-10 h-10 rounded-full flex items-center justify-center animate-blur-fade-up"
            style={{ animationDelay: "350ms" }}
            aria-label="Abrir menú"
          >
            <span className="relative w-[18px] h-[18px] block">
              <Menu
                size={18}
                className={`absolute inset-0 transition-all duration-500 ease-out ${open ? "rotate-180 opacity-0 scale-50" : "opacity-100"}`}
              />
              <X
                size={18}
                className={`absolute inset-0 transition-all duration-500 ease-out ${open ? "opacity-100" : "rotate-180 opacity-0 scale-50"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <MobileMenu open={open} links={NAV_LINKS} onNavigate={() => setOpen(false)} />
    </>
  );
}
```

- [ ] **Step 2: Mobile menu component**

```tsx
// src/components/layout/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";

type Props = {
  open: boolean;
  links: { href: string; label: string }[];
  onNavigate: () => void;
};

export default function MobileMenu({ open, links, onNavigate }: Props) {
  return (
    <div
      className={`absolute top-[72px] left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 shadow-2xl transition-all duration-500 ease-out ${
        open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col px-4 py-4">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="py-3 px-3 rounded-lg hover:bg-gray-800/50 transition-all"
            style={{
              transitionDelay: `${i * 50}ms`,
              transform: open ? "translateX(0)" : "translateX(-16px)",
            }}
          >
            {link.label}
          </Link>
        ))}
        <div className="sm:hidden flex gap-3 mt-3 pt-3 border-t border-gray-800">
          <button className="liquid-glass flex-1 rounded-full px-4 py-2 flex items-center justify-center gap-2 text-sm">
            <Search size={16} /> Buscar
          </button>
          <button className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center">
            <User size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Footer component**

```tsx
// src/components/layout/Footer.tsx
export default function Footer({ agencyBrand }: { agencyBrand: string }) {
  return (
    <footer className="relative z-10 px-4 sm:px-6 md:px-12 py-8 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
      <span>© {new Date().getFullYear()} Miguel Ceballos — Portafolio</span>
      <span>{agencyBrand}</span>
    </footer>
  );
}
```

- [ ] **Step 4: Install lucide-react and wire layout**

```bash
npm install lucide-react
```

```tsx
// src/app/layout.tsx (replace previous body content)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Miguel Ceballos — Portafolio",
  description: "Desarrollo web y soluciones digitales — ATENU BrandHouse",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findFirst();
  const portfolioBrand = settings?.portfolioBrand ?? "Miguel Ceballos — Portafolio";
  const agencyBrand = settings?.agencyBrand ?? "ATENU BrandHouse";

  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Navbar brand={portfolioBrand} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer agencyBrand={agencyBrand} />
      </body>
    </html>
  );
}
```

Note: `/admin/*` pages will inherit this public navbar/footer too until Task 9 gives `/admin` its own layout that opts out — Next.js nested layouts mean `src/app/admin/layout.tsx` (Task 9) fully replaces this concern for admin routes only if it doesn't render `{children}` through the root's `<main>` wrapper; since root layout always wraps everything, Task 9's admin layout will render its own chrome inside `<main>`. This is acceptable for F1 (admin still looks like part of the same site) and can be revisited in F2 if a fully separate admin shell is wanted.

- [ ] **Step 5: Verify**

Run `npm run dev`, open `http://localhost:3000`, confirm navbar renders with "Miguel Ceballos — Portafolio", links, search/user buttons, and resize to mobile width to confirm hamburger + slide-down menu work.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add public navbar, mobile menu, and footer"
```

---

### Task 8: Home hero page

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `prisma.siteSettings.findFirst()`.

- [ ] **Step 1: Implement cinematic hero reading from SiteSettings**

```tsx
// src/app/page.tsx
import { Star, Clock, Calendar, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const settings = await prisma.siteSettings.findFirst();
  const title = settings?.heroTitle ?? "Step Through. Work Smarter.";
  const description =
    settings?.heroDescription ?? "Desarrollo web y soluciones digitales para tu marca.";
  const videoUrl = settings?.heroVideoUrl;

  return (
    <div className="relative flex-1 flex flex-col min-h-[calc(100vh-88px)]">
      {videoUrl && (
        <video
          className="fixed inset-0 w-full h-full object-cover z-0"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="fixed inset-0 z-[1] backdrop-blur-xl bottom-blur-mask pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-col md:flex-row items-end gap-8">
          <div className="flex-1">
            <div
              className="flex flex-wrap gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm animate-blur-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Star size={16} className="fill-white sm:w-5 sm:h-5" /> 5.0 Clientes
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> Entregas ágiles
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> Disponible ahora
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-4 md:mb-6 animate-blur-fade-up"
              style={{ letterSpacing: "-0.04em", animationDelay: "400ms" }}
            >
              {title}
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-12 max-w-2xl animate-blur-fade-up"
              style={{ animationDelay: "500ms" }}
            >
              {description}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="/contacto"
                className="bg-white text-black rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-gray-200 transition-colors animate-blur-fade-up"
                style={{ animationDelay: "600ms" }}
              >
                <Play size={18} className="fill-black" /> Contáctame
              </a>
              <a
                href="/portafolio"
                className="liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 animate-blur-fade-up"
                style={{ animationDelay: "700ms" }}
              >
                Ver portafolio
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="liquid-glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 animate-blur-fade-up"
              style={{ animationDelay: "800ms" }}
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="liquid-glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 animate-blur-fade-up"
              style={{ animationDelay: "900ms" }}
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run `npm run dev`, open `http://localhost:3000`. Confirm title/description show the seeded defaults, staggered fade-up animation plays on load, buttons are liquid-glass styled. No video plays yet (expected — `heroVideoUrl` is null until set in admin/F2), page still renders correctly without it.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement cinematic home hero reading from SiteSettings"
```

---

### Task 9: Remaining public pages (placeholder content from DB)

**Files:**
- Create: `src/app/sobre-mi/page.tsx`
- Create: `src/app/portafolio/page.tsx`
- Create: `src/app/agencia/page.tsx`
- Create: `src/app/paquetes/page.tsx`
- Create: `src/app/reviews/page.tsx`
- Create: `src/app/contacto/page.tsx`

**Interfaces:**
- Consumes: `prisma` queries for `SiteSettings`, `PortfolioProject`, `Client` + `Story`, `Service`, `Review`.

- [ ] **Step 1: Sobre mí**

```tsx
// src/app/sobre-mi/page.tsx
import { prisma } from "@/lib/prisma";

export default async function SobreMiPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-6 animate-blur-fade-up">Sobre mí</h1>
      <p className="text-gray-400 text-base md:text-lg animate-blur-fade-up" style={{ animationDelay: "150ms" }}>
        {settings?.aboutText ||
          "Desarrollador web freelance y fundador de ATENU BrandHouse, ayudando a marcas a construir su presencia digital."}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Portafolio**

```tsx
// src/app/portafolio/page.tsx
import { prisma } from "@/lib/prisma";

export default async function PortafolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Portafolio</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={project.projectUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h2 className="text-xl font-medium mb-2">{project.title}</h2>
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
        {projects.length === 0 && <p className="text-gray-500">Aún no hay proyectos publicados.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Agencia**

```tsx
// src/app/agencia/page.tsx
import { prisma } from "@/lib/prisma";

export default async function AgenciaPage() {
  const settings = await prisma.siteSettings.findFirst();
  const clients = await prisma.client.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { stories: { where: { active: true }, orderBy: { order: "asc" } } },
  });

  const SERVICES = ["Fotografía", "Video", "Diseño gráfico", "Impresiones", "Merch"];

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-2 animate-blur-fade-up">
        {settings?.agencyBrand ?? "ATENU BrandHouse"}
      </h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Agencia de marketing digital.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        {SERVICES.map((service, i) => (
          <span
            key={service}
            className="liquid-glass rounded-full px-5 py-2 text-sm animate-blur-fade-up"
            style={{ animationDelay: `${150 + i * 50}ms` }}
          >
            {service}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-medium mb-6">Clientes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, i) => (
          <div
            key={client.id}
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h3 className="font-medium mb-1">{client.name}</h3>
            {client.website && (
              <a href={client.website} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-gray-300">
                {client.website}
              </a>
            )}
            <p className="text-xs text-gray-500 mt-2">{client.stories.length} stories</p>
          </div>
        ))}
        {clients.length === 0 && <p className="text-gray-500">Aún no hay clientes publicados.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Paquetes**

```tsx
// src/app/paquetes/page.tsx
import { prisma } from "@/lib/prisma";

export default async function PaquetesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Paquetes</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div
            key={service.id}
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h2 className="text-xl font-medium mb-2">{service.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            {service.price && (
              <p className="text-2xl font-semibold mb-4">${service.price.toString()}</p>
            )}
            <ul className="text-sm text-gray-400 space-y-1">
              {service.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
        {services.length === 0 && <p className="text-gray-500">Aún no hay paquetes publicados.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Reviews**

```tsx
// src/app/reviews/page.tsx
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Reviews</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, idx) => (
                <Star key={idx} size={16} className="fill-white" />
              ))}
            </div>
            <p className="text-gray-300 text-sm mb-3">&ldquo;{review.text}&rdquo;</p>
            <p className="text-gray-500 text-xs">{review.authorName}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">Aún no hay reviews publicadas.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Contacto (static form shell, no submission wiring — that's F4)**

```tsx
// src/app/contacto/page.tsx
export default function ContactoPage() {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-4 animate-blur-fade-up">Contacto</h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Cuéntame sobre tu proyecto y te responderé a la brevedad.
      </p>
      <form className="flex flex-col gap-4 animate-blur-fade-up" style={{ animationDelay: "200ms" }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <textarea
          name="message"
          placeholder="Mensaje"
          rows={5}
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <button
          type="button"
          disabled
          className="bg-white text-black rounded-full font-medium py-3 opacity-50 cursor-not-allowed"
        >
          Envío disponible próximamente
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 7: Verify all pages render**

Run `npm run dev` and open each: `/sobre-mi`, `/portafolio`, `/agencia`, `/paquetes`, `/reviews`, `/contacto`. Confirm each shows the seeded data from Task 5 (e.g. "Proyecto Demo" on `/portafolio`, "Cliente Demo" with "1 stories" on `/agencia`, "Paquete Esencial" on `/paquetes`, the 5-star review on `/reviews`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add remaining public pages with seeded content"
```

---

### Task 10: Admin shell — layout, sidebar, dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/logout-button.tsx`
- Create: placeholder pages: `src/app/admin/settings/page.tsx`, `src/app/admin/clients/page.tsx`, `src/app/admin/stories/page.tsx`, `src/app/admin/portfolio/page.tsx`, `src/app/admin/packages/page.tsx`, `src/app/admin/reviews/page.tsx`, `src/app/admin/social-links/page.tsx`, `src/app/admin/leads/page.tsx`

**Interfaces:**
- Consumes: `auth()` from `src/lib/auth.ts`, `signOut` from `src/lib/auth.ts`, `prisma` for dashboard counts.

- [ ] **Step 1: Admin layout with sidebar**

```tsx
// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <>{children}</>; // /admin/login renders standalone
  }

  return (
    <div className="flex min-h-[calc(100vh-88px)]">
      <AdminSidebar />
      <div className="flex-1 px-6 py-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Sidebar**

```tsx
// src/components/admin/AdminSidebar.tsx
import Link from "next/link";
import LogoutButton from "@/app/admin/logout-button";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Ajustes del sitio" },
  { href: "/admin/clients", label: "Clientes" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/portfolio", label: "Portafolio" },
  { href: "/admin/packages", label: "Paquetes" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/social-links", label: "Redes sociales" },
  { href: "/admin/leads", label: "Leads" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 liquid-glass rounded-2xl m-4 p-4 flex flex-col gap-1 h-fit">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </aside>
  );
}
```

- [ ] **Step 3: Logout button (server action)**

```tsx
// src/app/admin/logout-button.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/admin/login" })}
      className="mt-2 px-3 py-2 rounded-lg text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
```

- [ ] **Step 4: Dashboard with counts**

```tsx
// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [clients, projects, reviews, unreadLeads] = await Promise.all([
    prisma.client.count(),
    prisma.portfolioProject.count(),
    prisma.review.count(),
    prisma.lead.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Clientes", value: clients },
    { label: "Proyectos", value: projects },
    { label: "Reviews", value: reviews },
    { label: "Leads sin leer", value: unreadLeads },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="liquid-glass rounded-xl p-4">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Placeholder module pages**

Create each of the following with the same shape (swap the title only):

```tsx
// src/app/admin/settings/page.tsx
export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-2">Ajustes del sitio</h1>
      <p className="text-gray-400 text-sm">Editor disponible en la Fase 2.</p>
    </div>
  );
}
```

Repeat identically for `clients` ("Clientes"), `stories` ("Stories"), `portfolio` ("Portafolio"), `packages` ("Paquetes"), `reviews` ("Reviews"), `social-links` ("Redes sociales"), `leads` ("Leads"), each in its own file under `src/app/admin/<segment>/page.tsx` with a matching function name (e.g. `AdminClientsPage`, `AdminStoriesPage`) and matching `<h1>` title.

- [ ] **Step 6: Verify end to end**

Run `npm run dev`. Visit `/admin` while logged out → redirected to `/admin/login`. Log in with seeded credentials → land on `/admin` dashboard showing counts (Clientes: 1, Proyectos: 1, Reviews: 1, Leads sin leer: 0). Click through every sidebar link and confirm each renders its placeholder without error. Click "Cerrar sesión" → confirm redirect to `/admin/login` and that `/admin` is now protected again.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add admin shell with sidebar, dashboard, and module placeholders"
```

---

### Task 11: README and env documentation for deploy readiness

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: none consumed by code — documentation only.

- [ ] **Step 1: Write setup + deploy instructions**

```markdown
# Miguel Ceballos — Portafolio

Portafolio freelance con panel admin oculto, construido con Next.js 15, Prisma y Auth.js.
Incluye la sección de agencia **ATENU BrandHouse** (clientes, stories, paquetes, reviews).

## Desarrollo local

1. Copia las variables de entorno: `cp .env.example .env`
2. Genera un `AUTH_SECRET`: `npx auth secret --raw` y pégalo en `.env`
3. Levanta Postgres local: `docker compose up -d`
4. Instala dependencias: `npm install`
5. Aplica el schema: `npx prisma migrate dev`
6. Siembra datos de ejemplo (incluye el usuario admin): `npx prisma db seed`
7. Corre el sitio: `npm run dev` → http://localhost:3000
8. Panel admin: http://localhost:3000/admin/login (credenciales en `ADMIN_EMAIL`/`ADMIN_PASSWORD` de tu `.env`)

## Deploy a Vercel

1. Crea un proyecto en [Neon](https://neon.tech) y copia su connection string de Postgres.
2. En Vercel, configura las variables de entorno del proyecto:
   - `DATABASE_URL` → connection string de Neon (reemplaza la de Postgres local)
   - `AUTH_SECRET` → el mismo valor generado en local, o uno nuevo para producción
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` → credenciales del admin en producción
   - `BLOB_READ_WRITE_TOKEN` → token de [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (necesario para subir fotos/video de stories y portafolio, Fase 3)
3. Corre las migraciones contra Neon: `DATABASE_URL="<neon-url>" npx prisma migrate deploy`
4. Siembra el usuario admin en producción: `DATABASE_URL="<neon-url>" npx prisma db seed`
5. Deploy: conecta el repo en Vercel (auto-detecta Next.js) o `vercel --prod`.

## Fases del proyecto

Ver `docs/superpowers/specs/2026-08-14-portfolio-design.md` para el diseño completo y el roadmap de fases (F1 Fundación → F2 CRUD admin → F3 Stories/Blob → F4 Contacto/leads → F5 Deploy).
```

- [ ] **Step 2: Verify formatting renders correctly**

Open `README.md` in a Markdown preview and confirm headings/code blocks render as expected.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add local setup and Vercel deploy instructions"
```

---

## Self-Review Notes

- **Spec coverage:** stack ✅ (Task 1-6), design system ✅ (Task 2), all 9 data models ✅ (Task 4), all 6 public pages ✅ (Task 8-9), hidden admin login ✅ (Task 6), admin shell with all module links ✅ (Task 10), env/deploy docs ✅ (Task 11). CRUD functionality, Blob uploads, and contact submission are explicitly F2/F3/F4 and intentionally excluded here.
- **Placeholder scan:** no TBD/TODO; all code blocks are complete and runnable.
- **Type consistency:** `prisma.siteSettings`, `prisma.client`, `prisma.story`, `prisma.portfolioProject`, `prisma.service`, `prisma.review`, `prisma.lead` field names match the schema in Task 4 across every consuming task (7, 8, 9, 10).
