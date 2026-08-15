# Portafolio digital de Miguel Ceballos + ATENU BrandHouse — Diseño

## Contexto

Portafolio freelance de desarrollo web con un panel admin oculto para autogestionar
todo el contenido, incluyendo una sección dedicada a la agencia de marketing digital
del usuario (ATENU BrandHouse): clientes, "stories" de contenido (foto/video ≤15s),
reviews, paquetes de servicios y un panel de leads.

Referencias de diseño/funcionalidad:
- Estética visual: prompt "Cinematic hero" (negro puro, `liquid-glass`, `blurFadeUp`,
  tipografía Inter) — se adopta como design system para todo el sitio, no solo el hero.
- Funcionalidad de reviews/stories/admin/leads: proyecto hermano `PastranaEvents`
  (React + Express + Prisma) como referencia de patrones, adaptado a Next.js.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS, fuente Inter (Google Fonts)
- Prisma ORM + PostgreSQL (Neon en prod y dev — mismo motor, sin SQLite intermedio)
- Auth.js (NextAuth) Credentials provider — un único usuario admin, password hasheado (bcrypt)
- Vercel Blob para imágenes/video (portafolio, stories, fondos configurables del hero)
- Server Actions para todas las mutaciones del admin (sin API REST separada)

## Modelo de datos (Prisma, resumen)

- `User` — admin único (email, passwordHash)
- `SiteSettings` — singleton: nombre marca portafolio, nombre agencia, textos/título hero,
  video/imagen de fondo, descripción, redes sociales propias
- `Client` — clientes de la agencia (nombre, logo, redes sociales, activo)
- `Story` — foto/video ≤15s asociado a un `Client` (tipo, url, orden, activo, createdAt)
- `PortfolioProject` — proyectos de desarrollo web (título, descripción, imagen, url, tags)
- `Service` / `Package` — paquetes de servicios de la agencia (nombre, descripción, precio, features[])
- `Review` — testimonios de clientes (nombre, texto, rating, aprobado/oculto)
- `Lead` — mensajes del formulario de contacto/consulta de servicios (nombre, email, mensaje, paquete de interés, leído)
- `SocialLink` — enlaces de redes (propios y de clientes de la agencia)

## Estructura del sitio

**Público (SSR, contenido leído de la BD vía SiteSettings/queries):**
- `/` — Home cinematográfico (hero con video de fondo, título/descr. configurables)
- `/sobre-mi` — Sobre mí / sobre nosotros
- `/portafolio` — Proyectos de desarrollo web
- `/agencia` — ATENU BrandHouse: servicios (foto, video, diseño gráfico, impresiones, merch),
  grid de clientes, stories por cliente (visor tipo Instagram stories, ≤15s, autoplay)
- `/paquetes` — Paquetes y precios
- `/reviews` — Testimonios aprobados
- `/contacto` — Formulario de contacto + consulta de paquete de interés

**Admin oculto (`/admin`, no enlazado desde nav pública):**
- `/admin/login` — login credentials
- `/admin` — dashboard con resumen (leads sin leer, etc.)
- `/admin/settings` — editor de SiteSettings (títulos, textos, fondos, marcas)
- `/admin/clients`, `/admin/stories`, `/admin/portfolio`, `/admin/packages`,
  `/admin/reviews`, `/admin/social-links` — CRUD de cada módulo
- `/admin/leads` — bandeja de mensajes de contacto

## Fases

1. **F1 — Fundación** *(este ciclo)*: scaffold Next.js + Tailwind + design system
   (liquid-glass, blurFadeUp, Inter), schema Prisma completo + migración inicial,
   Auth.js con login admin funcional, layout público con navegación a todas las páginas
   con contenido placeholder/seed, shell del admin con dashboard vacío. Todo corre en
   local contra una rama Neon de desarrollo.
2. **F2** — CRUD completo de cada módulo admin (settings, clientes, portafolio, paquetes, reviews, social links).
3. **F3** — Stories: subida a Vercel Blob, visor tipo stories (≤15s, autoplay, navegación).
4. **F4** — Formulario de contacto → tabla `Lead` + bandeja en admin, pulido de UX/responsive.
5. **F5** — Preparación de deploy a Vercel (variables de entorno documentadas, build de producción).

## Entorno local

`DATABASE_URL` apunta a una rama Neon gratuita (mismo motor que producción). Se entrega
`.env.example` documentando todas las keys necesarias (`DATABASE_URL`, `AUTH_SECRET`,
`BLOB_READ_WRITE_TOKEN`). Sin `BLOB_READ_WRITE_TOKEN` el resto de la app funciona con
normalidad; solo la subida de archivos queda deshabilitada hasta agregar la key.

## Fuera de alcance (F1)

- Subida real de archivos a Blob (F3)
- CRUD funcional en el admin más allá del login (F2+)
- Envío de email de notificación de leads (se descartó; solo se guardan en BD)
- Internacionalización, analítica, testing automatizado
