import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request): Promise<NextResponse> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe no está configurado" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Firma de webhook de Stripe inválida:", error);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const token = session.metadata?.proposalToken;
    if (token) {
      await prisma.proposal.update({
        where: { token },
        data: { depositPaidAt: new Date() },
      }).catch((error) => {
        console.error("No se pudo marcar el anticipo como pagado:", error);
      });
    }
  }

  return NextResponse.json({ received: true });
}
