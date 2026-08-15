import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ projects: [], services: [] });
  }

  const [projects, services] = await Promise.all([
    prisma.portfolioProject.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { order: "asc" },
      take: 5,
      select: { id: true, title: true, description: true },
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
      take: 5,
      select: { id: true, name: true, description: true },
    }),
  ]);

  return NextResponse.json({ projects, services });
}
