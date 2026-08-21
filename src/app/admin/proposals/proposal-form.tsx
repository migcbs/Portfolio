"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";
import { ProposalItemsManager } from "@/components/admin/ProposalItemsManager";
import { sendProposal, setDepositPaid, type ProposalFormState } from "./actions";

type Item = { id: string; label: string; price: string };

type Values = {
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  depositPercent: number;
  validUntil: string;
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  ACCEPTED: "Aceptada",
  DECLINED: "Rechazada",
};

export function ProposalForm({
  action,
  defaultValues,
  editing,
  onSuccess,
}: {
  action: (prevState: ProposalFormState, formData: FormData) => Promise<ProposalFormState>;
  defaultValues?: Values;
  editing?: {
    id: string;
    token: string;
    status: string;
    items: Item[];
    signedByName: string | null;
    signedAt: string | Date | null;
    depositPaidAt: string | Date | null;
  };
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<ProposalFormState, FormData>(action, undefined);
  const [copied, setCopied] = useState(false);
  const [sending, startSendTransition] = useTransition();
  const [togglingDeposit, startDepositTransition] = useTransition();
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  useEffect(() => {
    if (state?.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const shareUrl = editing ? `${typeof window !== "undefined" ? window.location.origin : ""}/propuesta/${editing.token}` : "";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {editing && (
        <div className="flex items-center justify-between mb-4">
          <span className="label-mono px-3 py-1 rounded-full bg-white/10">{STATUS_LABEL[editing.status]}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="liquid-glass px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copiado" : "Copiar enlace"}
            </button>
            {editing.status === "DRAFT" && (
              <button
                type="button"
                disabled={sending}
                onClick={() => startSendTransition(() => sendProposal(editing.id))}
                className="bg-white text-black rounded-full font-medium px-3 py-1.5 text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Enviar al cliente"}
              </button>
            )}
          </div>
        </div>
      )}
      {editing?.signedAt && (
        <p className="text-green-400 text-xs mb-4">
          Firmada por {editing.signedByName} el {new Date(editing.signedAt).toLocaleString("es-MX")}
        </p>
      )}
      {editing?.status === "ACCEPTED" && (
        <div className="flex items-center gap-2 mb-4">
          {editing.depositPaidAt ? (
            <p className="text-green-400 text-xs">
              Anticipo pagado el {new Date(editing.depositPaidAt).toLocaleString("es-MX")}
            </p>
          ) : (
            <p className="text-xs text-gray-500">Anticipo pendiente (transferencia o efectivo, coordinado directamente).</p>
          )}
          <button
            type="button"
            disabled={togglingDeposit}
            onClick={() =>
              startDepositTransition(() => setDepositPaid(editing.id, !editing.depositPaidAt))
            }
            className="liquid-glass px-3 py-1 rounded-full text-xs shrink-0 disabled:opacity-50"
          >
            {editing.depositPaidAt ? "Marcar como no pagado" : "Marcar como pagado"}
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="title">
          Título de la propuesta
        </label>
        <input id="title" name="title" defaultValue={defaultValues?.title} className={inputClass} required />
        {state?.errors?.title?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
          className={inputClass}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="clientName">
          Nombre del cliente
        </label>
        <input id="clientName" name="clientName" defaultValue={defaultValues?.clientName} className={inputClass} required />
        {state?.errors?.clientName?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="clientEmail">
          Email del cliente
        </label>
        <input
          id="clientEmail"
          name="clientEmail"
          type="email"
          defaultValue={defaultValues?.clientEmail}
          className={inputClass}
          required
        />
        {state?.errors?.clientEmail?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="depositPercent">
          Anticipo (%)
        </label>
        <input
          id="depositPercent"
          name="depositPercent"
          type="number"
          min={0}
          max={100}
          defaultValue={defaultValues?.depositPercent ?? 50}
          className={inputClass}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="validUntil">
          Válida hasta (opcional)
        </label>
        <input
          id="validUntil"
          name="validUntil"
          type="date"
          defaultValue={defaultValues?.validUntil}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>

      {editing && <ProposalItemsManager proposalId={editing.id} items={editing.items} />}
    </form>
  );
}
