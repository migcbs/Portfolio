"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { sendResendNotification } from "@/lib/resend";
import { getStripe } from "@/lib/stripe";
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

export async function createDepositCheckout(token: string): Promise<{ url: string | null; error?: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { url: null, error: "El pago en línea no está configurado todavía. Contáctame para coordinarlo." };
  }

  const proposal = await prisma.proposal.findUnique({
    where: { token },
    include: { items: true },
  });
  if (!proposal || proposal.status !== "ACCEPTED") return { url: null, error: "Propuesta no disponible." };
  if (proposal.depositPaidAt) return { url: null, error: "El anticipo ya fue pagado." };

  const total = proposal.items.reduce((sum, item) => sum + Number(item.price), 0);
  const depositAmount = Math.round(total * (proposal.depositPercent / 100) * 100);
  if (depositAmount <= 0) return { url: null, error: "No hay anticipo configurado para esta propuesta." };

  const baseUrl = getBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "mxn",
          unit_amount: depositAmount,
          product_data: { name: `Anticipo — ${proposal.title}` },
        },
        quantity: 1,
      },
    ],
    customer_email: proposal.clientEmail,
    metadata: { proposalToken: token },
    success_url: `${baseUrl}/propuesta/${token}?paid=1`,
    cancel_url: `${baseUrl}/propuesta/${token}`,
  });

  return { url: session.url };
}
