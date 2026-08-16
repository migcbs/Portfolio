import { Resend } from "resend";
import type { BookingRequest } from "@prisma/client";

const CONTACT_LABEL: Record<string, string> = {
  EMAIL: "Email",
  PHONE: "Teléfono",
  WHATSAPP: "WhatsApp",
};

export async function sendBookingNotification(booking: BookingRequest, toEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !toEmail) {
    console.warn("RESEND_API_KEY o email de destino no configurados — solicitud guardada, sin correo enviado.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: `Nueva solicitud de agenda — ${booking.name}${booking.company ? ` (${booking.company})` : ""}`,
      text: [
        `Nombre: ${booking.name}`,
        booking.company ? `Empresa: ${booking.company}` : null,
        `Email: ${booking.email}`,
        booking.phone ? `Teléfono: ${booking.phone}` : null,
        `Contacto preferido: ${CONTACT_LABEL[booking.preferredContact] ?? booking.preferredContact}`,
        `Origen: ${booking.source}`,
        booking.message ? `Mensaje:\n${booking.message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error("Error enviando notificación de Resend:", error);
  }
}
