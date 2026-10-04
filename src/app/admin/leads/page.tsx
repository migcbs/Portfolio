import { prisma } from "@/lib/prisma";
import { LeadsBoard } from "./leads-board";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  return <LeadsBoard leads={leads} />;
}
