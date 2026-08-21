import { prisma } from "@/lib/prisma";
import { ProposalsManager } from "./proposals-manager";

export default async function AdminProposalsPage() {
  const rows = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  const proposals = rows.map((p) => ({
    ...p,
    items: p.items.map((item) => ({ ...item, price: item.price.toString() })),
  }));

  return <ProposalsManager proposals={proposals} />;
}
