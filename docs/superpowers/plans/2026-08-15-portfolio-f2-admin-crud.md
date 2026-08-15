# Portafolio F2 — CRUD del Admin: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full create/edit/delete for every F2 content module (Site Settings, Clients, Portfolio Projects, Packages/Services, Reviews, Social Links) from the admin panel, plus a working search page, a public review-submission form, a linked (not hidden) admin login button, and real placeholder imagery replacing the empty seed content.

**Architecture:** Each module follows the same pattern: a Zod schema in `src/lib/validations/`, Server Actions in the module's `actions.ts` (create/update/delete, each starting with `requireAdmin()`), a shared `<DeleteButton>` client component, a list page (`/admin/{module}`) and a single form component reused by `/admin/{module}/new` and `/admin/{module}/[id]/edit`. Public-facing additions (search, review submission) reuse the same design system but have no auth gate.

**Tech Stack:** Next.js 15 (App Router, Server Actions), TypeScript, Zod (new dependency) for validation, Prisma, existing Auth.js session for `requireAdmin()`.

## Global Constraints

- Design system verbatim: `.liquid-glass` panels/buttons, `.animate-blur-fade-up`, Inter — admin forms reuse the same visual language as the existing `/admin/login` page.
- No automated test suite (still out of scope project-wide) — verification is manual/CLI (build passing, curl/psql checks), not unit tests.
- Image/video fields are plain URL text inputs, Zod-validated as a valid URL or empty (empty → `null`). No file upload in this phase (Vercel Blob is F3).
- Delete confirmation uses the native browser `confirm()` — no custom modal.
- Every mutating Server Action must call `requireAdmin()` first (defense in depth — Server Actions are callable directly, not just via the protected page's UI, so each one re-checks the session rather than relying solely on middleware/layout).
- All list/detail queries continue using `dynamic = "force-dynamic"` pages (established in F1) so admin edits are reflected immediately on the public site — no additional caching to invalidate beyond calling `revalidatePath()` on the affected public route from each mutating action.
- `SiteSettings` is a singleton keyed at `id = "singleton"` (F1 final-review fix) — its Server Actions always target that fixed id, never create a second row.
- `SocialLink.clientId` is nullable (F1 final-review fix) — the form must support "no client" (a link that isn't tied to a specific client) as well as picking one.

---

### Task 1: Zod schemas, `requireAdmin`, shared `DeleteButton`

**Files:**
- Create: `src/lib/validations/shared.ts`
- Create: `src/lib/validations/client.ts`
- Create: `src/lib/validations/portfolio-project.ts`
- Create: `src/lib/validations/service.ts`
- Create: `src/lib/validations/review.ts`
- Create: `src/lib/validations/social-link.ts`
- Create: `src/lib/validations/site-settings.ts`
- Create: `src/lib/require-admin.ts`
- Create: `src/components/admin/DeleteButton.tsx`

**Interfaces:**
- Consumes: `auth` from `@/lib/auth` (Task 6 of F1).
- Produces: `requireAdmin(): Promise<Session>` (throws if unauthenticated) and all Zod schemas/types below, consumed by every subsequent task's `actions.ts` and form component. `<DeleteButton id={string} action={(id: string) => Promise<void>} itemLabel={string} />` consumed by every list page (Tasks 3-7).

- [ ] **Step 1: Install Zod**

```bash
npm install zod
```

- [ ] **Step 2: Shared validation helpers**

```ts
// src/lib/validations/shared.ts
import { z } from "zod";

export const optionalUrl = z
  .string()
  .trim()
  .url("Debe ser una URL válida")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
```

- [ ] **Step 3: Client schema**

```ts
// src/lib/validations/client.ts
import { z } from "zod";
import { optionalUrl } from "./shared";

export const clientSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  logoUrl: optionalUrl,
  website: optionalUrl,
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type ClientInput = z.infer<typeof clientSchema>;
```

- [ ] **Step 4: Portfolio project schema**

```ts
// src/lib/validations/portfolio-project.ts
import { z } from "zod";
import { optionalUrl } from "./shared";

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1, "El título es requerido"),
  description: z.string().trim().min(1, "La descripción es requerida"),
  imageUrl: optionalUrl,
  projectUrl: optionalUrl,
  tags: z.array(z.string()).default([]),
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type PortfolioProjectInput = z.infer<typeof portfolioProjectSchema>;
```

- [ ] **Step 5: Service schema**

```ts
// src/lib/validations/service.ts
import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  description: z.string().trim().min(1, "La descripción es requerida"),
  price: z.coerce.number().nonnegative("El precio no puede ser negativo").nullable(),
  features: z.array(z.string()).default([]),
  active: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
```

- [ ] **Step 6: Review schemas (admin + public)**

```ts
// src/lib/validations/review.ts
import { z } from "zod";

export const reviewAdminSchema = z.object({
  authorName: z.string().trim().min(1, "El nombre es requerido"),
  text: z.string().trim().min(1, "El texto es requerido"),
  rating: z.coerce.number().int().min(1).max(5),
  approved: z.boolean(),
});

export const reviewPublicSchema = z.object({
  authorName: z.string().trim().min(1, "Tu nombre es requerido").max(100),
  text: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
  rating: z.coerce.number().int().min(1, "Selecciona una calificación").max(5),
});

export type ReviewAdminInput = z.infer<typeof reviewAdminSchema>;
export type ReviewPublicInput = z.infer<typeof reviewPublicSchema>;
```

- [ ] **Step 7: Social link schema**

```ts
// src/lib/validations/social-link.ts
import { z } from "zod";

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "La etiqueta es requerida"),
  url: z.string().trim().url("Debe ser una URL válida"),
  scope: z.enum(["PERSONAL", "AGENCY"]),
  clientId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  order: z.coerce.number().int().default(0),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
```

- [ ] **Step 8: Site settings schema**

```ts
// src/lib/validations/site-settings.ts
import { z } from "zod";
import { optionalUrl, optionalText } from "./shared";

export const siteSettingsSchema = z.object({
  portfolioBrand: z.string().trim().min(1, "Requerido"),
  agencyBrand: z.string().trim().min(1, "Requerido"),
  heroTitle: z.string().trim().min(1, "Requerido"),
  heroDescription: z.string().trim().min(1, "Requerido"),
  heroVideoUrl: optionalUrl,
  heroImageUrl: optionalUrl,
  aboutText: optionalText,
  contactEmail: optionalText,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
```

- [ ] **Step 9: `requireAdmin` helper**

```ts
// src/lib/require-admin.ts
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("No autorizado");
  }
  return session;
}
```

- [ ] **Step 10: Shared `DeleteButton`**

```tsx
// src/components/admin/DeleteButton.tsx
"use client";

import { useTransition } from "react";

type Props = {
  id: string;
  action: (id: string) => Promise<void>;
  itemLabel: string;
};

export function DeleteButton({ id, action, itemLabel }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`¿Eliminar "${itemLabel}"? Esta acción no se puede deshacer.`)) {
          startTransition(() => action(id));
        }
      }}
      className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
```

- [ ] **Step 11: Verify build**

```bash
node node_modules/next/dist/bin/next build
```

Expected: compiles with zero errors (nothing renders these yet, but everything must type-check).

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add Zod schemas, requireAdmin guard, and shared DeleteButton"
```

---

### Task 2: Site Settings editor (singleton form) + hero image fallback

**Files:**
- Create: `src/app/admin/settings/actions.ts`
- Modify: `src/app/admin/settings/page.tsx`
- Modify: `src/app/page.tsx` (add `heroImageUrl` fallback rendering)

**Interfaces:**
- Consumes: `requireAdmin`, `siteSettingsSchema`, `getSiteSettings` (from `src/lib/site-settings.ts`, F1).
- Produces: nothing new consumed by later tasks (Settings has no list/delete, it's a singleton).

- [ ] **Step 1: Settings Server Action**

```ts
// src/app/admin/settings/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SettingsFormState = { errors?: Record<string, string[] | undefined> } | undefined;

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    portfolioBrand: formData.get("portfolioBrand"),
    agencyBrand: formData.get("agencyBrand"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    heroVideoUrl: formData.get("heroVideoUrl"),
    heroImageUrl: formData.get("heroImageUrl"),
    aboutText: formData.get("aboutText"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/sobre-mi");
  revalidatePath("/agencia");
  redirect("/admin/settings?success=1");
}
```

- [ ] **Step 2: Settings form page**

```tsx
// src/app/admin/settings/page.tsx
"use client";

import { useActionState } from "react";
import { updateSiteSettings, type SettingsFormState } from "./actions";

// Note: this page needs current values, so it's split into a server wrapper
// (below) that fetches settings and passes them as defaultValues to this
// client form. See Step 3 for the actual file layout — this step alone is
// superseded by Step 3's two-file version.
```

- [ ] **Step 3: Correct two-file layout — server page + client form**

Replace the single `page.tsx` with a server component that fetches data, plus a client form component:

```tsx
// src/app/admin/settings/page.tsx
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Ajustes del sitio</h1>
      <SettingsForm
        defaultValues={{
          portfolioBrand: settings?.portfolioBrand ?? "",
          agencyBrand: settings?.agencyBrand ?? "",
          heroTitle: settings?.heroTitle ?? "",
          heroDescription: settings?.heroDescription ?? "",
          heroVideoUrl: settings?.heroVideoUrl ?? "",
          heroImageUrl: settings?.heroImageUrl ?? "",
          aboutText: settings?.aboutText ?? "",
          contactEmail: settings?.contactEmail ?? "",
        }}
      />
    </div>
  );
}
```

```tsx
// src/app/admin/settings/settings-form.tsx
"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { updateSiteSettings, type SettingsFormState } from "./actions";

type Values = {
  portfolioBrand: string;
  agencyBrand: string;
  heroTitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  aboutText: string;
  contactEmail: string;
};

function Field({
  name,
  label,
  defaultValue,
  errors,
  textarea,
}: {
  name: string;
  label: string;
  defaultValue: string;
  errors?: string[];
  textarea?: boolean;
}) {
  const className =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1.5" htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={4} className={className} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className={className} />
      )}
      {errors?.map((err) => (
        <p key={err} className="text-red-400 text-xs mt-1">
          {err}
        </p>
      ))}
    </div>
  );
}

export function SettingsForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateSiteSettings,
    undefined
  );
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <Field
        name="portfolioBrand"
        label="Nombre del portafolio"
        defaultValue={defaultValues.portfolioBrand}
        errors={state?.errors?.portfolioBrand}
      />
      <Field
        name="agencyBrand"
        label="Nombre de la agencia"
        defaultValue={defaultValues.agencyBrand}
        errors={state?.errors?.agencyBrand}
      />
      <Field
        name="heroTitle"
        label="Título del hero"
        defaultValue={defaultValues.heroTitle}
        errors={state?.errors?.heroTitle}
      />
      <Field
        name="heroDescription"
        label="Descripción del hero"
        defaultValue={defaultValues.heroDescription}
        errors={state?.errors?.heroDescription}
        textarea
      />
      <Field
        name="heroVideoUrl"
        label="URL de video de fondo (opcional)"
        defaultValue={defaultValues.heroVideoUrl}
        errors={state?.errors?.heroVideoUrl}
      />
      <Field
        name="heroImageUrl"
        label="URL de imagen de fondo (opcional, se usa si no hay video)"
        defaultValue={defaultValues.heroImageUrl}
        errors={state?.errors?.heroImageUrl}
      />
      <Field
        name="aboutText"
        label="Texto de 'Sobre mí' (opcional)"
        defaultValue={defaultValues.aboutText}
        errors={state?.errors?.aboutText}
        textarea
      />
      <Field
        name="contactEmail"
        label="Email de contacto (opcional)"
        defaultValue={defaultValues.contactEmail}
        errors={state?.errors?.contactEmail}
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
```

Delete the placeholder content from Step 2 — Step 3 is the real implementation.

- [ ] **Step 4: Hero image fallback on the home page**

Modify `src/app/page.tsx`: currently only renders `<video>` when `videoUrl` is truthy. Add an `<img>` fallback when there's no video but there is `heroImageUrl`:

```tsx
// src/app/page.tsx — replace the existing video block with:
{videoUrl ? (
  <video
    className="fixed inset-0 w-full h-full object-cover z-0"
    src={videoUrl}
    autoPlay
    muted
    loop
    playsInline
  />
) : imageUrl ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={imageUrl} alt="" className="fixed inset-0 w-full h-full object-cover z-0" />
) : null}
```

And add `const imageUrl = settings?.heroImageUrl;` alongside the existing `const videoUrl = settings?.heroVideoUrl;` line. (Plain `<img>` is intentional here — the URL is admin-supplied and arbitrary, so `next/image` domain allowlisting would need to change per URL; F3's real upload flow can revisit this.)

- [ ] **Step 5: Verify**

```bash
node node_modules/next/dist/bin/next build
```

Then manually verify with the dev server + curl: start `npm run dev`, log in, `curl` (with the session cookie) a POST to submit updated settings via the form is hard to script — instead just confirm the page renders the form pre-filled with current DB values (`curl` the authenticated `/admin/settings` page and grep for the seeded `heroTitle` value inside an `value=` or between `>...<` for the textarea). Kill the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add site settings editor and hero image fallback"
```

---

### Task 3: Clients CRUD

**Files:**
- Create: `src/app/admin/clients/actions.ts`
- Create: `src/app/admin/clients/client-form.tsx`
- Modify: `src/app/admin/clients/page.tsx`
- Create: `src/app/admin/clients/new/page.tsx`
- Create: `src/app/admin/clients/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `clientSchema`, `DeleteButton`.
- Produces: none consumed elsewhere (Task 7's SocialLink form independently queries `prisma.client.findMany()` for its own dropdown, not through this task's files).

- [ ] **Step 1: Server Actions**

```ts
// src/app/admin/clients/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { clientSchema } from "@/lib/validations/client";

export type ClientFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl"),
    website: formData.get("website"),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.client.create({ data: parsed.data });
  revalidatePath("/admin/clients");
  revalidatePath("/agencia");
  redirect("/admin/clients?success=created");
}

export async function updateClient(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.client.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/clients");
  revalidatePath("/agencia");
  redirect("/admin/clients?success=updated");
}

export async function deleteClient(id: string): Promise<void> {
  await requireAdmin();
  await prisma.client.delete({ where: { id } });
  revalidatePath("/admin/clients");
  revalidatePath("/agencia");
}
```

- [ ] **Step 2: Shared form component**

```tsx
// src/app/admin/clients/client-form.tsx
"use client";

import { useActionState } from "react";
import type { ClientFormState } from "./actions";

type Values = { name: string; logoUrl: string; website: string; active: boolean; order: number };

export function ClientForm({
  action,
  defaultValues,
}: {
  action: (prevState: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  defaultValues?: Values;
}) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" defaultValue={defaultValues?.name} className={inputClass} required />
        {state?.errors?.name?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="logoUrl">
          URL del logo (opcional)
        </label>
        <input id="logoUrl" name="logoUrl" defaultValue={defaultValues?.logoUrl} className={inputClass} />
        {state?.errors?.logoUrl?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="website">
          Sitio web (opcional)
        </label>
        <input id="website" name="website" defaultValue={defaultValues?.website} className={inputClass} />
        {state?.errors?.website?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm text-gray-400">
          Activo (visible en el sitio público)
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: List page**

```tsx
// src/app/admin/clients/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteClient } from "./actions";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Clientes</h1>
        <Link
          href="/admin/clients/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo cliente
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Sitio web</th>
              <th className="p-4">Orden</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{client.name}</td>
                <td className="p-4 text-gray-400">{client.website ?? "—"}</td>
                <td className="p-4 text-gray-400">{client.order}</td>
                <td className="p-4 text-gray-400">{client.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/clients/${client.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={client.id} action={deleteClient} itemLabel={client.name} />
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Aún no hay clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: New page**

```tsx
// src/app/admin/clients/new/page.tsx
import { ClientForm } from "../client-form";
import { createClient } from "../actions";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo cliente</h1>
      <ClientForm action={createClient} />
    </div>
  );
}
```

- [ ] **Step 5: Edit page**

```tsx
// src/app/admin/clients/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "../../client-form";
import { updateClient } from "../../actions";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar cliente</h1>
      <ClientForm
        action={updateClient.bind(null, id)}
        defaultValues={{
          name: client.name,
          logoUrl: client.logoUrl ?? "",
          website: client.website ?? "",
          active: client.active,
          order: client.order,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Verify end to end**

Start dev server, log in, curl `/admin/clients` (with session cookie) and confirm the seeded "Cliente Demo" row appears with Editar/Eliminar links. Curl `/admin/clients/new` and confirm the form renders. Kill dev server when done. (A full create/edit/delete round-trip is verified in Task 3's task-review, not required to script here — but do at least confirm all three pages render without error.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Clients CRUD (create, edit, delete)"
```

---

### Task 4: Portfolio Projects CRUD

**Files:**
- Create: `src/app/admin/portfolio/actions.ts`
- Create: `src/app/admin/portfolio/portfolio-form.tsx`
- Modify: `src/app/admin/portfolio/page.tsx`
- Create: `src/app/admin/portfolio/new/page.tsx`
- Create: `src/app/admin/portfolio/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `portfolioProjectSchema`, `parseCommaList`, `DeleteButton`.

- [ ] **Step 1: Server Actions**

```ts
// src/app/admin/portfolio/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioProjectSchema } from "@/lib/validations/portfolio-project";
import { parseCommaList } from "@/lib/validations/shared";

export type PortfolioFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return portfolioProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    projectUrl: formData.get("projectUrl"),
    tags: parseCommaList(String(formData.get("tags") ?? "")),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createPortfolioProject(
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.portfolioProject.create({ data: parsed.data });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
  redirect("/admin/portfolio?success=created");
}

export async function updatePortfolioProject(
  id: string,
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.portfolioProject.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
  redirect("/admin/portfolio?success=updated");
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
}
```

- [ ] **Step 2: Shared form component**

```tsx
// src/app/admin/portfolio/portfolio-form.tsx
"use client";

import { useActionState } from "react";
import type { PortfolioFormState } from "./actions";

type Values = {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string;
  active: boolean;
  order: number;
};

export function PortfolioForm({
  action,
  defaultValues,
}: {
  action: (prevState: PortfolioFormState, formData: FormData) => Promise<PortfolioFormState>;
  defaultValues?: Values;
}) {
  const [state, formAction, pending] = useActionState<PortfolioFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="title">
          Título
        </label>
        <input id="title" name="title" defaultValue={defaultValues?.title} className={inputClass} required />
        {state?.errors?.title?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
          className={inputClass}
          required
        />
        {state?.errors?.description?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="imageUrl">
          URL de imagen (opcional)
        </label>
        <input id="imageUrl" name="imageUrl" defaultValue={defaultValues?.imageUrl} className={inputClass} />
        {state?.errors?.imageUrl?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="projectUrl">
          URL del proyecto (opcional)
        </label>
        <input id="projectUrl" name="projectUrl" defaultValue={defaultValues?.projectUrl} className={inputClass} />
        {state?.errors?.projectUrl?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="tags">
          Tags (separados por coma)
        </label>
        <input id="tags" name="tags" defaultValue={defaultValues?.tags} className={inputClass} placeholder="Next.js, Diseño Web" />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm text-gray-400">
          Activo (visible en el sitio público)
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: List page**

```tsx
// src/app/admin/portfolio/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePortfolioProject } from "./actions";

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Portafolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo proyecto
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Título</th>
              <th className="p-4">Orden</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{project.title}</td>
                <td className="p-4 text-gray-400">{project.order}</td>
                <td className="p-4 text-gray-400">{project.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/portfolio/${project.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={project.id} action={deletePortfolioProject} itemLabel={project.title} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay proyectos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: New page**

```tsx
// src/app/admin/portfolio/new/page.tsx
import { PortfolioForm } from "../portfolio-form";
import { createPortfolioProject } from "../actions";

export default function NewPortfolioProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo proyecto</h1>
      <PortfolioForm action={createPortfolioProject} />
    </div>
  );
}
```

- [ ] **Step 5: Edit page**

```tsx
// src/app/admin/portfolio/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioForm } from "../../portfolio-form";
import { updatePortfolioProject } from "../../actions";

export default async function EditPortfolioProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar proyecto</h1>
      <PortfolioForm
        action={updatePortfolioProject.bind(null, id)}
        defaultValues={{
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl ?? "",
          projectUrl: project.projectUrl ?? "",
          tags: project.tags.join(", "),
          active: project.active,
          order: project.order,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Verify**

Start dev server, log in, curl `/admin/portfolio`, `/admin/portfolio/new` with session cookie, confirm both render with the seeded "Proyecto Demo" listed. Kill dev server when done.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Portfolio Projects CRUD (create, edit, delete)"
```

---

### Task 5: Packages/Services CRUD

**Files:**
- Create: `src/app/admin/packages/actions.ts`
- Create: `src/app/admin/packages/service-form.tsx`
- Modify: `src/app/admin/packages/page.tsx`
- Create: `src/app/admin/packages/new/page.tsx`
- Create: `src/app/admin/packages/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `serviceSchema`, `parseCommaList`, `DeleteButton`.

- [ ] **Step 1: Server Actions**

```ts
// src/app/admin/packages/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { serviceSchema } from "@/lib/validations/service";
import { parseCommaList } from "@/lib/validations/shared";

export type ServiceFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  const rawPrice = String(formData.get("price") ?? "").trim();
  return serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: rawPrice === "" ? null : rawPrice,
    features: parseCommaList(String(formData.get("features") ?? "")),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.service.create({ data: parsed.data });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
  redirect("/admin/packages?success=created");
}

export async function updateService(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.service.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
  redirect("/admin/packages?success=updated");
}

export async function deleteService(id: string): Promise<void> {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
}
```

- [ ] **Step 2: Shared form component**

```tsx
// src/app/admin/packages/service-form.tsx
"use client";

import { useActionState } from "react";
import type { ServiceFormState } from "./actions";

type Values = {
  name: string;
  description: string;
  price: string;
  features: string;
  active: boolean;
  order: number;
};

export function ServiceForm({
  action,
  defaultValues,
}: {
  action: (prevState: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  defaultValues?: Values;
}) {
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" defaultValue={defaultValues?.name} className={inputClass} required />
        {state?.errors?.name?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
          className={inputClass}
          required
        />
        {state?.errors?.description?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="price">
          Precio (opcional)
        </label>
        <input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price} className={inputClass} />
        {state?.errors?.price?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="features">
          Características (separadas por coma)
        </label>
        <input
          id="features"
          name="features"
          defaultValue={defaultValues?.features}
          className={inputClass}
          placeholder="Diseño a medida, Hosting incluido"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm text-gray-400">
          Activo (visible en el sitio público)
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: List page**

```tsx
// src/app/admin/packages/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteService } from "./actions";

export default async function AdminPackagesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Paquetes</h1>
        <Link
          href="/admin/packages/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo paquete
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{service.name}</td>
                <td className="p-4 text-gray-400">{service.price ? `$${service.price.toString()}` : "—"}</td>
                <td className="p-4 text-gray-400">{service.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/packages/${service.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={service.id} action={deleteService} itemLabel={service.name} />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay paquetes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: New page**

```tsx
// src/app/admin/packages/new/page.tsx
import { ServiceForm } from "../service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo paquete</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
```

- [ ] **Step 5: Edit page**

```tsx
// src/app/admin/packages/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../../service-form";
import { updateService } from "../../actions";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar paquete</h1>
      <ServiceForm
        action={updateService.bind(null, id)}
        defaultValues={{
          name: service.name,
          description: service.description,
          price: service.price?.toString() ?? "",
          features: service.features.join(", "),
          active: service.active,
          order: service.order,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Verify**

Start dev server, log in, curl `/admin/packages` and `/admin/packages/new` with session cookie, confirm the seeded "Paquete Esencial" is listed. Kill dev server when done.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Packages/Services CRUD (create, edit, delete)"
```

---

### Task 6: Reviews CRUD (admin) with approve/hide

**Files:**
- Create: `src/app/admin/reviews/actions.ts`
- Create: `src/app/admin/reviews/review-form.tsx`
- Modify: `src/app/admin/reviews/page.tsx`
- Create: `src/app/admin/reviews/new/page.tsx`
- Create: `src/app/admin/reviews/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `reviewAdminSchema`, `DeleteButton`.

- [ ] **Step 1: Server Actions**

```ts
// src/app/admin/reviews/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { reviewAdminSchema } from "@/lib/validations/review";

export type ReviewFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return reviewAdminSchema.safeParse({
    authorName: formData.get("authorName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    approved: formData.get("approved") === "on",
  });
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.review.create({ data: parsed.data });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews?success=created");
}

export async function updateReview(
  id: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.review.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews?success=updated");
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function toggleReviewApproved(id: string, approved: boolean): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}
```

- [ ] **Step 2: Shared form component**

```tsx
// src/app/admin/reviews/review-form.tsx
"use client";

import { useActionState } from "react";
import type { ReviewFormState } from "./actions";

type Values = { authorName: string; text: string; rating: number; approved: boolean };

export function ReviewForm({
  action,
  defaultValues,
}: {
  action: (prevState: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
  defaultValues?: Values;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="authorName">
          Nombre del autor
        </label>
        <input
          id="authorName"
          name="authorName"
          defaultValue={defaultValues?.authorName}
          className={inputClass}
          required
        />
        {state?.errors?.authorName?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="text">
          Texto
        </label>
        <textarea id="text" name="text" defaultValue={defaultValues?.text} rows={4} className={inputClass} required />
        {state?.errors?.text?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="rating">
          Calificación (1-5)
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={defaultValues?.rating ?? 5}
          className={inputClass}
        />
        {state?.errors?.rating?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="approved"
          name="approved"
          type="checkbox"
          defaultChecked={defaultValues?.approved ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="approved" className="text-sm text-gray-400">
          Aprobada (visible en el sitio público)
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: List page with inline approve toggle**

```tsx
// src/app/admin/reviews/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteReview } from "./actions";
import { ApproveToggle } from "./approve-toggle";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nueva review
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Autor</th>
              <th className="p-4">Calificación</th>
              <th className="p-4">Aprobada</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{review.authorName}</td>
                <td className="p-4 text-gray-400">{review.rating}/5</td>
                <td className="p-4">
                  <ApproveToggle id={review.id} approved={review.approved} />
                </td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/reviews/${review.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={review.id} action={deleteReview} itemLabel={review.authorName} />
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay reviews.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Approve toggle client component**

```tsx
// src/app/admin/reviews/approve-toggle.tsx
"use client";

import { useTransition } from "react";
import { toggleReviewApproved } from "./actions";

export function ApproveToggle({ id, approved }: { id: string; approved: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleReviewApproved(id, !approved))}
      className={`text-xs px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
        approved ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-400"
      }`}
    >
      {pending ? "..." : approved ? "Aprobada" : "Pendiente"}
    </button>
  );
}
```

- [ ] **Step 5: New page**

```tsx
// src/app/admin/reviews/new/page.tsx
import { ReviewForm } from "../review-form";
import { createReview } from "../actions";

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nueva review</h1>
      <ReviewForm action={createReview} />
    </div>
  );
}
```

- [ ] **Step 6: Edit page**

```tsx
// src/app/admin/reviews/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "../../review-form";
import { updateReview } from "../../actions";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar review</h1>
      <ReviewForm
        action={updateReview.bind(null, id)}
        defaultValues={{
          authorName: review.authorName,
          text: review.text,
          rating: review.rating,
          approved: review.approved,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 7: Verify**

Start dev server, log in, curl `/admin/reviews` with session cookie, confirm the seeded "Cliente Satisfecho" review is listed with an "Aprobada" badge (it was seeded with `approved: true`). Kill dev server when done.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Reviews CRUD with approve/hide toggle"
```

---

### Task 7: Social Links CRUD

**Files:**
- Create: `src/app/admin/social-links/actions.ts`
- Create: `src/app/admin/social-links/social-link-form.tsx`
- Modify: `src/app/admin/social-links/page.tsx`
- Create: `src/app/admin/social-links/new/page.tsx`
- Create: `src/app/admin/social-links/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `socialLinkSchema`, `DeleteButton`. Independently queries `prisma.client.findMany()` for the optional client-select dropdown (not through Task 3's files).

- [ ] **Step 1: Server Actions**

```ts
// src/app/admin/social-links/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { socialLinkSchema } from "@/lib/validations/social-link";

export type SocialLinkFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return socialLinkSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    scope: formData.get("scope"),
    clientId: formData.get("clientId"),
    order: formData.get("order"),
  });
}

export async function createSocialLink(
  _prevState: SocialLinkFormState,
  formData: FormData
): Promise<SocialLinkFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.socialLink.create({ data: parsed.data });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
  redirect("/admin/social-links?success=created");
}

export async function updateSocialLink(
  id: string,
  _prevState: SocialLinkFormState,
  formData: FormData
): Promise<SocialLinkFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.socialLink.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
  redirect("/admin/social-links?success=updated");
}

export async function deleteSocialLink(id: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
}
```

- [ ] **Step 2: Shared form component (with client dropdown)**

```tsx
// src/app/admin/social-links/social-link-form.tsx
"use client";

import { useActionState } from "react";
import type { SocialLinkFormState } from "./actions";

type Values = { label: string; url: string; scope: "PERSONAL" | "AGENCY"; clientId: string; order: number };
type ClientOption = { id: string; name: string };

export function SocialLinkForm({
  action,
  defaultValues,
  clients,
}: {
  action: (prevState: SocialLinkFormState, formData: FormData) => Promise<SocialLinkFormState>;
  defaultValues?: Values;
  clients: ClientOption[];
}) {
  const [state, formAction, pending] = useActionState<SocialLinkFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="label">
          Etiqueta
        </label>
        <input id="label" name="label" defaultValue={defaultValues?.label} className={inputClass} placeholder="Instagram" required />
        {state?.errors?.label?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="url">
          URL
        </label>
        <input id="url" name="url" defaultValue={defaultValues?.url} className={inputClass} required />
        {state?.errors?.url?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="scope">
          Alcance
        </label>
        <select id="scope" name="scope" defaultValue={defaultValues?.scope ?? "PERSONAL"} className={inputClass}>
          <option value="PERSONAL">Personal</option>
          <option value="AGENCY">Agencia</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="clientId">
          Cliente (opcional)
        </label>
        <select id="clientId" name="clientId" defaultValue={defaultValues?.clientId ?? ""} className={inputClass}>
          <option value="">Ninguno</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: List page**

```tsx
// src/app/admin/social-links/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSocialLink } from "./actions";

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
    include: { client: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Redes sociales</h1>
        <Link
          href="/admin/social-links/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo enlace
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Etiqueta</th>
              <th className="p-4">Alcance</th>
              <th className="p-4">Cliente</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{link.label}</td>
                <td className="p-4 text-gray-400">{link.scope === "AGENCY" ? "Agencia" : "Personal"}</td>
                <td className="p-4 text-gray-400">{link.client?.name ?? "—"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/social-links/${link.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={link.id} action={deleteSocialLink} itemLabel={link.label} />
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay enlaces.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: New page**

```tsx
// src/app/admin/social-links/new/page.tsx
import { prisma } from "@/lib/prisma";
import { SocialLinkForm } from "../social-link-form";
import { createSocialLink } from "../actions";

export default async function NewSocialLinkPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo enlace</h1>
      <SocialLinkForm action={createSocialLink} clients={clients} />
    </div>
  );
}
```

- [ ] **Step 5: Edit page**

```tsx
// src/app/admin/social-links/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SocialLinkForm } from "../../social-link-form";
import { updateSocialLink } from "../../actions";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [link, clients] = await Promise.all([
    prisma.socialLink.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!link) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar enlace</h1>
      <SocialLinkForm
        action={updateSocialLink.bind(null, id)}
        clients={clients}
        defaultValues={{
          label: link.label,
          url: link.url,
          scope: link.scope,
          clientId: link.clientId ?? "",
          order: link.order,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Verify**

Start dev server, log in, curl `/admin/social-links` and `/admin/social-links/new` with session cookie, confirm both render (list will be empty — no social links were seeded in F1, that's expected). Kill dev server when done.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Social Links CRUD (create, edit, delete)"
```

---

### Task 8: Public review submission form

**Files:**
- Create: `src/app/reviews/actions.ts`
- Create: `src/app/reviews/review-submit-form.tsx`
- Modify: `src/app/reviews/page.tsx`

**Interfaces:**
- Consumes: `reviewPublicSchema` (Task 1). Does NOT call `requireAdmin` — this is a public, unauthenticated action.

- [ ] **Step 1: Public Server Action**

```ts
// src/app/reviews/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { reviewPublicSchema } from "@/lib/validations/review";

export type PublicReviewFormState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function submitPublicReview(
  _prevState: PublicReviewFormState,
  formData: FormData
): Promise<PublicReviewFormState> {
  const parsed = reviewPublicSchema.safeParse({
    authorName: formData.get("authorName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.review.create({
    data: { ...parsed.data, approved: false },
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}
```

Note: no `revalidatePath("/reviews")` here — the new review is `approved: false`, so it must NOT appear on the public `/reviews` page until an admin approves it (which already revalidates `/reviews` via Task 6's `toggleReviewApproved`). Revalidating `/admin/reviews` lets the admin see the new pending submission without a manual refresh.

- [ ] **Step 2: Public submission form component**

```tsx
// src/app/reviews/review-submit-form.tsx
"use client";

import { useActionState } from "react";
import { submitPublicReview, type PublicReviewFormState } from "./actions";

export function ReviewSubmitForm() {
  const [state, formAction, pending] = useActionState<PublicReviewFormState, FormData>(
    submitPublicReview,
    undefined
  );
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  if (state?.success) {
    return (
      <div className="liquid-glass rounded-2xl p-6 max-w-xl">
        <p className="text-green-400 text-sm">
          ¡Gracias por tu reseña! Se publicará después de ser revisada.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <h2 className="text-lg font-medium mb-4">Deja tu reseña</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="authorName">
          Tu nombre
        </label>
        <input id="authorName" name="authorName" className={inputClass} required />
        {state?.errors?.authorName?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="rating">
          Calificación (1-5)
        </label>
        <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} className={inputClass} />
        {state?.errors?.rating?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="text">
          Tu experiencia
        </label>
        <textarea id="text" name="text" rows={4} className={inputClass} required />
        {state?.errors?.text?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Wire into the reviews page**

```tsx
// src/app/reviews/page.tsx — add the import and render the form below the grid
import { ReviewSubmitForm } from "./review-submit-form";
```

Add `<div className="mt-12"><ReviewSubmitForm /></div>` right after the closing `</div>` of the existing reviews grid, still inside the page's outer container.

- [ ] **Step 4: Verify**

Start dev server, curl `/reviews` (no auth needed, public page) and confirm the form renders ("Deja tu reseña", the three fields, submit button). A full submit round-trip is verified in this task's review, not required to script here — but at minimum confirm the page still renders the existing approved reviews grid unchanged above the new form. Kill dev server when done.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add public review submission form"
```

---

### Task 9: Search page + navbar links (buscar + ingresar)

**Files:**
- Create: `src/app/buscar/page.tsx`
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `prisma` directly for a case-insensitive `contains` search over `PortfolioProject` and `Service`.

- [ ] **Step 1: Search page**

```tsx
// src/app/buscar/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [projects, services] = query
    ? await Promise.all([
        prisma.portfolioProject.findMany({
          where: {
            active: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
        prisma.service.findMany({
          where: {
            active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
      ])
    : [[], []];

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-8 animate-blur-fade-up">Buscar</h1>
      <form className="mb-10 max-w-xl" action="/buscar">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar proyectos o paquetes..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
      </form>

      {query && projects.length === 0 && services.length === 0 && (
        <p className="text-gray-500">No se encontraron resultados para &ldquo;{query}&rdquo;.</p>
      )}

      {projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Proyectos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href="/portafolio"
                className="liquid-glass rounded-2xl p-6 block"
              >
                <h3 className="font-medium mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Paquetes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} href="/paquetes" className="liquid-glass rounded-2xl p-6 block">
                <h3 className="font-medium mb-1">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire navbar buttons**

In `src/components/layout/Navbar.tsx`, change the "Buscar" button from a `<Link href="/contacto">` to `<Link href="/buscar">` (same styling, just the destination). Change the user-icon `<div>` (currently a non-interactive decorative div) to a `<Link href="/admin/login">` with the same classes, so it's a real clickable element:

```tsx
// Replace the search button's href:
<Link
  href="/buscar"
  className="hidden sm:flex liquid-glass rounded-full px-4 md:px-6 py-2 items-center gap-2 text-sm animate-blur-fade-up"
  style={{ animationDelay: "350ms" }}
>
  <Search size={18} />
  Buscar
</Link>

// Replace the decorative user div with a real link:
<Link
  href="/admin/login"
  className="hidden sm:flex liquid-glass w-10 h-10 rounded-full items-center justify-center animate-blur-fade-up"
  style={{ animationDelay: "400ms" }}
  aria-label="Ingresar"
>
  <User size={18} />
</Link>
```

Also update `MobileMenu.tsx`'s bottom `sm:hidden` section the same way: its "Buscar" `<button>` becomes a `<Link href="/buscar">`, and its user `<button>` becomes a `<Link href="/admin/login">`, keeping the existing classes (swap `button` for `Link` and add the `href`, import `Link` from `next/link` if not already imported).

- [ ] **Step 3: Verify**

Start dev server, curl `/buscar?q=Demo` (no auth needed) and confirm it returns the seeded "Proyecto Demo" under a "Proyectos" heading. Curl `/` and grep the nav HTML for `href="/buscar"` and `href="/admin/login"` to confirm both links are wired. Kill dev server when done.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add search page and wire navbar search/login links"
```

---

### Task 10: Real placeholder imagery in seed data

**Files:**
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: nothing new. Produces updated seed data consumed by manual verification only (not by other tasks — this is the last task).

- [ ] **Step 1: Update seed with real image URLs**

Modify `prisma/seed.ts` to use real, stable, freely-usable stock photo URLs (Unsplash direct CDN links, which don't require an API key and are safe to hotlink for a portfolio demo) instead of the placehold.co placeholder. Update these specific blocks:

```ts
// SiteSettings create — add heroImageUrl as a fallback background:
if (settingsCount === 0) {
  await prisma.siteSettings.create({
    data: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
    },
  });
}
```

```ts
// Client — real-looking logo:
const client = await prisma.client.upsert({
  where: { id: "seed-client-1" },
  update: {},
  create: {
    id: "seed-client-1",
    name: "Cliente Demo",
    website: "https://example.com",
    logoUrl:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80",
    order: 0,
  },
});
```

```ts
// Story — real image instead of placehold.co:
await prisma.story.upsert({
  where: { id: "seed-story-1" },
  update: {},
  create: {
    id: "seed-story-1",
    clientId: client.id,
    type: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=720&q=80",
    order: 0,
  },
});
```

```ts
// PortfolioProject — real project screenshot-style image:
await prisma.portfolioProject.upsert({
  where: { id: "seed-project-1" },
  update: {},
  create: {
    id: "seed-project-1",
    title: "Proyecto Demo",
    description: "Sitio web desarrollado a la medida.",
    projectUrl: "https://example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "Diseño Web"],
    order: 0,
  },
});
```

Leave the `Service` and `Review` seed blocks and the admin `User` upsert unchanged — they have no image fields.

- [ ] **Step 2: Re-seed and verify**

Since these are `upsert`s keyed on fixed ids, re-running the seed updates the existing rows in place:

```bash
npx prisma db seed
PGPASSWORD=portfolio /opt/homebrew/opt/postgresql@16/bin/psql -h localhost -U portfolio -d portfolio -c "SELECT \"heroImageUrl\" FROM \"SiteSettings\";"
```

(Adjust the `psql` path via `brew --prefix postgresql@16` if it differs on this machine.) Expected: the `heroImageUrl` column now shows the Unsplash URL instead of being empty.

Then start the dev server and curl `/` to confirm the `<img>` fallback from Task 2 now renders with that URL in its `src` attribute (since there's still no `heroVideoUrl` seeded, the image fallback path is what's exercised). Curl `/agencia` and `/portafolio` and grep for the new image URLs in the client and project cards — note that the current card markup from F1 doesn't actually render an `<img>` tag for client logos or project images yet (F1 built text-only cards); confirm the URLs are at least present in the underlying data by checking the admin edit pages (`/admin/clients/[id]/edit`, `/admin/portfolio/[id]/edit`) show the new URLs pre-filled in the `logoUrl`/`imageUrl` inputs — actual `<img>` rendering on the public cards is a nice-to-have polish, not required by this task (the fields existing and being editable is what F2 promises; visual polish of the public cards can be a follow-up). Kill the dev server when done.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: replace placeholder seed images with real stock photo URLs"
```

---

## Self-Review Notes

- **Spec coverage:** CRUD for all 6 modules ✅ (Tasks 2-7), search ✅ (Task 9), public review submission ✅ (Task 8), login link ✅ (Task 9), real placeholder images ✅ (Task 10). Stories CRUD correctly excluded (F3). Contact form/leads correctly excluded (F4).
- **Placeholder scan:** Task 2's Step 2 is intentionally superseded by Step 3 (documented inline as the correct two-file layout, not a TBD) — every other step has complete, runnable code.
- **Type consistency:** every module's `actions.ts` exports a `*FormState` type consumed by exactly one form component; `DeleteButton`'s `action: (id: string) => Promise<void>` signature matches every module's `delete*` action exactly (all six take a single `id: string` and return `Promise<void>`).
- **Security:** every mutating action calls `requireAdmin()` before touching the database, closing the gap where a Server Action could be invoked directly without going through the protected page's UI.
