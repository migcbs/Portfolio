import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProposalView } from "./proposal-view";

export const dynamic = "force-dynamic";

export default async function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({
    where: { token },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!proposal) notFound();

  const plainProposal = {
    ...proposal,
    validUntil: proposal.validUntil?.toISOString() ?? null,
    signedAt: proposal.signedAt?.toISOString() ?? null,
    depositPaidAt: proposal.depositPaidAt?.toISOString() ?? null,
    items: proposal.items.map((item) => ({ ...item, price: item.price.toString() })),
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-2xl mx-auto">
      <ProposalView proposal={plainProposal} />
    </div>
  );
}
