import { prisma } from "@/lib/prisma";
import { RequestsBoard } from "./requests-board";

export default async function AdminRequestsPage() {
  const requests = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  return <RequestsBoard requests={requests} />;
}
