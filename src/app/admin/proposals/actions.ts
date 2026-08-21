"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { proposalSchema } from "@/lib/validations/proposal";
import { sendProposalToClient } from "@/lib/resend";
import { getBaseUrl } from "@/lib/site-url";

export type ProposalFormState = { errors?: Record<string, string[] | undefined>; success?: boolean } | undefined;

function parseForm(formData: FormData) {
  return proposalSchema.safeParse({
    clientName: formData.get("clientName"),
    clientEmail: formData.get("clientEmail"),
    title: formData.get("title"),
    description: formData.get("description"),
    depositPercent: formData.get("depositPercent"),
    validUntil: formData.get("validUntil"),
  });
}

function revalidateAll() {
  revalidatePath("/admin/proposals");
}

export async function createProposal(
  _prevState: ProposalFormState,
  formData: FormData
): Promise<ProposalFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.proposal.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateProposal(
  id: string,
  _prevState: ProposalFormState,
  formData: FormData
): Promise<ProposalFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.proposal.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteProposal(id: string): Promise<void> {
  await requireAdmin();
  await prisma.proposal.delete({ where: { id } });
  revalidateAll();
}

export async function addProposalItem(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = Number(priceRaw);
  if (!label || !priceRaw || Number.isNaN(price) || price < 0) return;

  const count = await prisma.proposalItem.count({ where: { proposalId: id } });
  await prisma.proposalItem.create({ data: { proposalId: id, label, price, order: count } });
  revalidateAll();
}

export async function deleteProposalItem(itemId: string): Promise<void> {
  await requireAdmin();
  await prisma.proposalItem.delete({ where: { id: itemId } });
  revalidateAll();
}

export async function sendProposal(id: string): Promise<void> {
  await requireAdmin();
  const proposal = await prisma.proposal.update({ where: { id }, data: { status: "SENT" } });
  const url = `${getBaseUrl()}/propuesta/${proposal.token}`;
  await sendProposalToClient({
    clientEmail: proposal.clientEmail,
    clientName: proposal.clientName,
    title: proposal.title,
    url,
  });
  revalidateAll();
}

export async function setDepositPaid(id: string, paid: boolean): Promise<void> {
  await requireAdmin();
  await prisma.proposal.update({ where: { id }, data: { depositPaidAt: paid ? new Date() : null } });
  revalidateAll();
}
