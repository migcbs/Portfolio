# Miguel Ceballos — Portafolio

Portafolio freelance con panel admin oculto, construido con Next.js 15, Prisma y Auth.js.
Incluye la sección de agencia **JXRXNX BrandHouse** (paquetes, reviews).

## Desarrollo local

1. Instala Postgres 16 si no lo tienes: `brew install postgresql@16` y arráncalo como servicio: `brew services start postgresql@16`
2. Crea el rol y la base de datos (solo la primera vez):
   ```bash
   /opt/homebrew/opt/postgresql@16/bin/psql postgres -c "CREATE ROLE portfolio WITH LOGIN PASSWORD 'portfolio' CREATEDB;"
   /opt/homebrew/opt/postgresql@16/bin/createdb -O portfolio portfolio
   ```
   (ajusta la ruta si `brew --prefix postgresql@16` reporta algo distinto en tu máquina)
3. Copia las variables de entorno: `cp .env.example .env`
4. Genera un `AUTH_SECRET` (en Node 20+): `npx auth secret --raw`, o si tu Node es más antiguo: `openssl rand -base64 32` — pégalo en `.env`
5. Instala dependencias: `npm install` (esto también regenera el cliente de Prisma automáticamente)
6. Aplica el schema: `npx prisma migrate dev`
7. Siembra datos de ejemplo (incluye el usuario admin): `npx prisma db seed`
8. Corre el sitio: `npm run dev` → http://localhost:3000
9. Panel admin: http://localhost:3000/admin/login (credenciales en `ADMIN_EMAIL`/`ADMIN_PASSWORD` de tu `.env`)

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
