import type { HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

// Node <20 doesn't expose the web File API as a global (only via
// node:buffer), but @vercel/blob references `File` at module scope. Vercel's
// build/runtime is Node 20+, so this only matters for local dev/build on
// older Node — the dynamic import below keeps @vercel/blob/client from
// loading (and throwing) until a request actually comes in.
if (typeof File === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { File: NodeFile } = require("node:buffer");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).File = NodeFile;
}

export async function POST(request: Request): Promise<NextResponse> {
  const { handleUpload } = await import("@vercel/blob/client");
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireAdmin();
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
