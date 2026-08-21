"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CalendarCheck } from "lucide-react";
import { submitBookingRequest, getAvailableSlotsAction, type BookingFormState } from "@/app/booking-actions";

type Variant = "solid" | "glass";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingButton({
  source,
  label = "Agenda ya",
  variant = "solid",
  className = "",
}: {
  source: string;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    submitBookingRequest,
    undefined
  );
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoadingSlots(true);
    setSlot(null);
    getAvailableSlotsAction(date)
      .then(setSlots)
      .finally(() => setLoadingSlots(false));
  }, [open, date]);

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const buttonClass =
    variant === "solid"
      ? "bg-white text-black rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-gray-200 transition-colors"
      : "liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 flex items-center gap-2";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass} ${className}`}>
        <CalendarCheck size={18} />
        {label}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
          >
          <div
            className="relative w-full max-w-md md:max-w-lg liquid-glass rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Agenda una cita</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {state?.success ? (
              <p className="text-green-400 text-sm py-4">
                ¡Gracias! Recibimos tu solicitud y te contactaremos pronto.
              </p>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="source" value={source} />
                <input type="hidden" name="scheduledDate" value={slot ? date : ""} />
                <input type="hidden" name="scheduledTime" value={slot ?? ""} />

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    ¿Quieres elegir fecha y hora? (opcional)
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={todayStr()}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {loadingSlots && <span className="text-xs text-gray-500">Buscando horarios...</span>}
                    {!loadingSlots && slots?.length === 0 && (
                      <span className="text-xs text-gray-500">No hay horarios disponibles ese día.</span>
                    )}
                    {!loadingSlots &&
                      slots?.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSlot(s === slot ? null : s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            s === slot
                              ? "bg-white text-black border-white"
                              : "liquid-glass border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <input name="name" placeholder="Nombre" className={inputClass} required />
                  {state?.errors?.name?.map((e) => (
                    <p key={e} className="text-red-400 text-xs mt-1">
                      {e}
                    </p>
                  ))}
                </div>
                <div>
                  <input name="company" placeholder="Empresa (opcional)" className={inputClass} />
                </div>
                <div>
                  <input type="email" name="email" placeholder="Email" className={inputClass} required />
                  {state?.errors?.email?.map((e) => (
                    <p key={e} className="text-red-400 text-xs mt-1">
                      {e}
                    </p>
                  ))}
                </div>
                <div>
                  <input type="tel" name="phone" placeholder="Teléfono (opcional)" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Prefiero que te contacte por</label>
                  <select name="preferredContact" defaultValue="EMAIL" className={inputClass}>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Teléfono</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Cuéntame qué necesitas (opcional)"
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-white text-black rounded-full font-medium py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {pending ? "Enviando..." : slot ? `Agendar ${date} ${slot}` : "Enviar solicitud"}
                </button>
              </form>
            )}
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
