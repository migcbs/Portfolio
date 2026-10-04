"use client";

import { useState, useTransition } from "react";
import { AddButton, RemoveButton } from "@/components/admin/IconButton";
import {
  addProjectTask,
  applyProjectTemplate,
  deleteProjectTask,
  toggleProjectTask,
} from "@/app/admin/portfolio/actions";
import { PROJECT_TEMPLATES, PROJECT_TYPE_LABELS, TASK_PHASES, TASK_PHASE_LABELS } from "@/lib/project-templates";

type Task = { id: string; phase: string; label: string; done: boolean };

export function ProjectChecklist({
  projectId,
  tasks,
  projectType,
}: {
  projectId: string;
  tasks: Task[];
  projectType: string | null;
}) {
  const [, startTransition] = useTransition();
  const [newLabel, setNewLabel] = useState("");
  const [newPhase, setNewPhase] = useState<string>("DEVELOPMENT");

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const templateHasItems = projectType ? (PROJECT_TEMPLATES[projectType]?.length ?? 0) > 0 : false;

  function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    const fd = new FormData();
    fd.set("label", label);
    fd.set("phase", newPhase);
    startTransition(() => addProjectTask(projectId, fd));
    setNewLabel("");
  }

  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <div className="mb-6 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">Checklist del proyecto</p>
        {total > 0 && (
          <span className="label-mono text-gray-400">
            {doneCount}/{total} · {pct}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Solo para ti — ayuda a seguir el proceso habitual de diseño, desarrollo, cliente, control de calidad y
        entrega. Los criterios se ajustan libremente: agrega o quita los que necesite este proyecto.
      </p>

      {total === 0 && templateHasItems && (
        <button
          type="button"
          onClick={() => startTransition(() => applyProjectTemplate(projectId, projectType as string))}
          className="liquid-glass px-4 py-2 rounded-full text-sm mb-4"
        >
          Generar checklist sugerido para {PROJECT_TYPE_LABELS[projectType as string]}
        </button>
      )}

      {TASK_PHASES.map((phase) => {
        const items = tasks.filter((t) => t.phase === phase);
        if (items.length === 0) return null;
        return (
          <div key={phase} className="mb-4">
            <p className="label-mono text-gray-500 mb-2">{TASK_PHASE_LABELS[phase]}</p>
            <div className="space-y-1.5">
              {items.map((task) => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(e) => startTransition(() => toggleProjectTask(task.id, e.target.checked))}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className={`text-sm flex-1 ${task.done ? "line-through text-gray-500" : "text-gray-200"}`}>
                    {task.label}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <RemoveButton onClick={() => startTransition(() => deleteProjectTask(task.id))} label={`Quitar ${task.label}`} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
        <select value={newPhase} onChange={(e) => setNewPhase(e.target.value)} className={inputClass}>
          {TASK_PHASES.map((phase) => (
            <option key={phase} value={phase}>
              {TASK_PHASE_LABELS[phase]}
            </option>
          ))}
        </select>
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Nueva tarea..."
          className={`${inputClass} flex-1`}
        />
        <AddButton onClick={handleAdd} label="Agregar tarea" />
      </div>
    </div>
  );
}
