"use client";

import { useActionState, useState, useTransition } from "react";
import { acceptProposal, declineProposal, type AcceptFormState } from "./actions";

type Item = { id: string; label: string; price: string };
type Proposal = {
  token: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string | null;
  depositPercent: number;
  validUntil: string | null;
  status: string;
  signedByName: string | null;
  signedAt: string | null;
  depositPaidAt: string | null;
  items: Item[];
};

export function ProposalView({ proposal }: { proposal: Proposal }) {
  const acceptWithToken = acceptProposal.bind(null, proposal.token);
  const [state, formAction, pending] = useActionState<AcceptFormState, FormData>(acceptWithToken, undefined);
  const [declining, startDeclineTransition] = useTransition();
  const [declined, setDeclined] = useState(false);

  const total = proposal.items.reduce((sum, item) => sum + Number(item.price), 0);
  const depositAmount = total * (proposal.depositPercent / 100);
  const accepted = proposal.status === "ACCEPTED" || state?.success;
  const isDeclined = proposal.status === "DECLINED" || declined;
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <div className="liquid-glass rounded-2xl p-6 sm:p-10 animate-blur-fade-up">
      <p className="label-mono text-gray-500 mb-2">Propuesta para {proposal.clientName}</p>
      <h1 className="text-2xl md:text-4xl font-normal mb-4">{proposal.title}</h1>
      {proposal.description && <p className="text-gray-400 mb-6">{proposal.description}</p>}
      {proposal.validUntil && (
        <p className="text-xs text-gray-500 mb-6">
          Válida hasta {new Date(proposal.validUntil).toLocaleDateString("es-MX", { dateStyle: "long" })}
        </p>
      )}

      <div className="space-y-2 mb-4">
        {proposal.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm">{item.label}</span>
            <span className="text-sm text-gray-400">${Number(item.price).toLocaleString("es-MX")}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Total</span>
        <span className="text-xl font-semibold">${total.toLocaleString("es-MX")}</span>
      </div>
      {proposal.depositPercent > 0 && (
        <p className="text-sm text-gray-400 mb-8">
          Anticipo ({proposal.depositPercent}%): ${depositAmount.toLocaleString("es-MX")}
        </p>
      )}

      {isDeclined ? (
        <p className="text-gray-400 text-sm">Esta propuesta fue rechazada.</p>
      ) : accepted ? (
        <div>
          <p className="text-green-400 text-sm mb-4">
            {proposal.signedByName
              ? `Aceptada por ${proposal.signedByName}${proposal.signedAt ? ` el ${new Date(proposal.signedAt).toLocaleDateString("es-MX")}` : ""}.`
              : "¡Gracias! Propuesta aceptada."}
          </p>
          {proposal.depositPercent > 0 &&
            (proposal.depositPaidAt ? (
              <p className="text-green-400 text-sm">Anticipo pagado. ¡Gracias!</p>
            ) : (
              <p className="text-sm text-gray-400">
                Nos pondremos en contacto contigo directamente para coordinar el pago del anticipo (transferencia
                o efectivo).
              </p>
            ))}
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Escribe tu nombre completo para firmar</label>
            <input name="signedByName" placeholder="Nombre completo" className={inputClass} required />
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-400">
            <input type="checkbox" name="agreed" className="mt-1 w-4 h-4" required />
            Acepto los términos de esta propuesta.
          </label>
          {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-white text-black rounded-full font-medium py-2.5 px-6 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {pending ? "Enviando..." : "Aceptar y firmar"}
            </button>
            <button
              type="button"
              disabled={declining}
              onClick={() =>
                startDeclineTransition(async () => {
                  await declineProposal(proposal.token);
                  setDeclined(true);
                })
              }
              className="liquid-glass rounded-full font-medium py-2.5 px-6 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {declining ? "..." : "Rechazar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
