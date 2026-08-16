import { prisma } from "@/lib/prisma";
import { ClientsManager } from "./clients-manager";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });

  return <ClientsManager clients={clients} />;
}
