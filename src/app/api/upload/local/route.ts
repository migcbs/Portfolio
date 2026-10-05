import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

// Dev-only fallback for admin uploads when BLOB_READ_WRITE_TOKEN isn't set:
// writes into public/uploads (gitignored) so local editing works without
// Vercel Blob. Never active in production, where Blob is the source of truth.
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production" || process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Subida local deshabilitada" }, { status: 404 });
  }
  await requireAdmin();

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Archivo demasiado grande" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
