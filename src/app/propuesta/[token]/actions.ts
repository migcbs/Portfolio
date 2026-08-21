"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { sendResendNotification } from "@/lib/resend";
import { getBaseUrl } from "@/lib/site-url";

export type AcceptFormState = { error?: string; success?: boolean } | undefined;

export async function acceptProposal(
  token: string,
  _prevState: AcceptFormState,
  formData: FormData
): Promise<AcceptFormState> {
  const signedByName = String(formData.get("signedByName") ?? "").trim();
  const agreed = formData.get("agreed") === "on";
  if (!signedByName) return { error: "Escribe tu nombre completo para firmar." };
  if (!agreed) return { error: "Debes aceptar los términos de la propuesta." };

  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal || proposal.status === "ACCEPTED") return { error: "Esta propuesta ya no está disponible." };

  const forwardedFor = (await headers()).get("x-forwarded-for");
  const signedIp = forwardedFor?.split(",")[0]?.trim() ?? null;

  await prisma.proposal.update({
    where: { token },
    data: { status: "ACCEPTED", signedByName, signedAt: new Date(), signedIp },
  });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendResendNotification(
    `Propuesta aceptada — ${proposal.title}`,
    [
      `${proposal.clientName} (${proposal.clientEmail}) aceptó la propuesta "${proposal.title}".`,
      `Firmado como: ${signedByName}`,
      `Revísala en ${getBaseUrl()}/admin/proposals`,
    ],
    toEmail
  );

  revalidatePath(`/propuesta/${token}`);
  return { success: true };
}

export async function declineProposal(token: string): Promise<void> {
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal || proposal.status === "ACCEPTED") return;

  await prisma.proposal.update({ where: { token }, data: { status: "DECLINED" } });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendResendNotification(
    `Propuesta rechazada — ${proposal.title}`,
    [`${proposal.clientName} (${proposal.clientEmail}) rechazó la propuesta "${proposal.title}".`],
    toEmail
  );

  revalidatePath(`/propuesta/${token}`);
}
