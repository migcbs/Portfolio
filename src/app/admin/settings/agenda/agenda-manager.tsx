"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { addAvailability, deleteAvailability, toggleAvailability, updateMeetingDuration } from "./actions";

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type Rule = { id: string; dayOfWeek: number; startTime: string; endTime: string; active: boolean };

export function AgendaManager({ rules, meetingDurationMinutes }: { rules: Rule[]; meetingDurationMinutes: number }) {
  const [, startTransition] = useTransition();
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(String(meetingDurationMinutes));
  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  function handleAdd() {
    const fd = new FormData();
    fd.set("dayOfWeek", dayOfWeek);
    fd.set("startTime", startTime);
    fd.set("endTime", endTime);
    startTransition(() => addAvailability(fd));
  }

  const sorted = [...rules].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));

  return (
    <div>
      <div className="liquid-glass rounded-2xl p-6 max-w-xl mb-6">
        <h2 className="text-lg font-medium mb-1">Duración de la reunión</h2>
        <p className="text-xs text-gray-500 mb-4">Cada horario disponible se divide en bloques de esta duración.</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={15}
            max={180}
            step={5}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={`${inputClass} w-24`}
          />
          <span className="text-sm text-gray-400">minutos</span>
          <button
            type="button"
            onClick={() => startTransition(() => updateMeetingDuration(Number(duration)))}
            className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl p-6 max-w-xl">
        <h2 className="text-lg font-medium mb-1">Horarios disponibles</h2>
        <p className="text-xs text-gray-500 mb-4">
          Hora de Ciudad de México (GMT-6). Los clientes solo verán horarios dentro de estos bloques que no
          estén ya ocupados.
        </p>

        <div className="space-y-2 mb-4">
          {sorted.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between liquid-glass rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startTransition(() => toggleAvailability(rule.id, !rule.active))}
                  className={`text-xs px-2 py-1 rounded-full ${
                    rule.active ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-500"
                  }`}
                >
                  {rule.active ? "Activo" : "Inactivo"}
                </button>
                <span className="text-sm">
                  {DAY_LABELS[rule.dayOfWeek]} · {rule.startTime}–{rule.endTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => startTransition(() => deleteAvailability(rule.id))}
                aria-label="Eliminar horario"
                className="text-gray-500 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {sorted.length === 0 && <p className="text-sm text-gray-500">Aún no hay horarios configurados.</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className={inputClass}>
            {DAY_LABELS.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
          <button
            type="button"
            onClick={handleAdd}
            className="bg-white text-black rounded-xl font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
          >
            Agregar horario
          </button>
        </div>
      </div>
    </div>
  );
}
