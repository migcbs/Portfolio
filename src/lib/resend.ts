import { Resend } from "resend";
import type { BookingRequest, Lead, Review } from "@prisma/client";

const CONTACT_LABEL: Record<string, string> = {
  EMAIL: "Email",
  PHONE: "Teléfono",
  WHATSAPP: "WhatsApp",
};

export async function sendResendNotification(subject: string, lines: (string | null)[], toEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !toEmail) {
    console.warn("RESEND_API_KEY o email de destino no configurados — guardado en la base de datos, sin correo enviado.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject,
      text: lines.filter(Boolean).join("\n"),
    });
    if (error) {
      console.error("Resend rechazó el envío:", error);
    }
  } catch (error) {
    console.error("Error enviando notificación de Resend:", error);
  }
}

export async function sendBookingNotification(booking: BookingRequest, toEmail: string) {
  await sendResendNotification(
    `Nueva solicitud de agenda — ${booking.name}${booking.company ? ` (${booking.company})` : ""}`,
    [
      `Nombre: ${booking.name}`,
      booking.company ? `Empresa: ${booking.company}` : null,
      `Email: ${booking.email}`,
      booking.phone ? `Teléfono: ${booking.phone}` : null,
      `Contacto preferido: ${CONTACT_LABEL[booking.preferredContact] ?? booking.preferredContact}`,
      `Origen: ${booking.source}`,
      booking.scheduledAt
        ? `Cita agendada: ${booking.scheduledAt.toLocaleString("es-MX", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "America/Mexico_City",
          })}`
        : null,
      booking.message ? `Mensaje:\n${booking.message}` : null,
    ],
    toEmail
  );
}

const PROJECT_TYPE_LABEL: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
};
const MARKETING_FOCUS_LABEL: Record<string, string> = {
  DESIGN: "Diseño",
  PHOTO_VIDEO: "Fotografía y Video",
};

export async function sendLeadNotification(lead: Lead, toEmail: string) {
  await sendResendNotification(`Nuevo mensaje de contacto — ${lead.name}`, [
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.projectType ? `Tipo de proyecto: ${PROJECT_TYPE_LABEL[lead.projectType] ?? lead.projectType}` : null,
    lead.marketingFocus ? `Enfoque: ${MARKETING_FOCUS_LABEL[lead.marketingFocus] ?? lead.marketingFocus}` : null,
    `Mensaje:\n${lead.message}`,
  ], toEmail);
}

export async function sendReviewNotification(review: Review, toEmail: string) {
  await sendResendNotification(`Nueva reseña pendiente de aprobar — ${review.authorName}`, [
    `Autor: ${review.authorName}`,
    `Calificación: ${review.rating}/5`,
    `Texto:\n${review.text}`,
    "",
    "Revísala y apruébala desde /admin/reviews.",
  ], toEmail);
}

export async function sendProposalToClient(params: {
  clientEmail: string;
  clientName: string;
  title: string;
  url: string;
}) {
  await sendResendNotification(
    `Propuesta: ${params.title}`,
    [
      `Hola ${params.clientName},`,
      "",
      "Te comparto la propuesta para tu proyecto. Puedes revisarla y aceptarla aquí:",
      params.url,
    ],
    params.clientEmail
  );
}
