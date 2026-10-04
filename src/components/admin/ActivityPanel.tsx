"use client";

import { useState, useTransition } from "react";
import { AddButton, RemoveButton } from "@/components/admin/IconButton";
import { formatDate, isOverdue } from "@/components/admin/RecordCard";

type NoteItem = { id: string; text: string; createdAt: string | Date };

/** Follow-up date + notes, shown inline inside a lead/request detail pop-up. */
export function ActivityPanel({
  id,
  followUpAt,
  notes,
  setFollowUpAt,
  addNote,
  deleteNote,
}: {
  id: string;
  followUpAt: string | Date | null;
  notes: NoteItem[];
  setFollowUpAt: (id: string, date: string) => Promise<void>;
  addNote: (id: string, formData: FormData) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  const dateValue = followUpAt ? new Date(followUpAt).toISOString().slice(0, 10) : "";
  const overdue = isOverdue(followUpAt);

  function handleAddNote() {
    if (!text.trim()) return;
    const fd = new FormData();
    fd.set("text", text);
    startTransition(() => addNote(id, fd));
    setText("");
  }

  return (
    <div className="border-t border-white/10 pt-5 mt-5">
      <h3 className="text-sm font-medium mb-3">Seguimiento</h3>
      <div className="mb-5">
        <label className="block label-mono text-gray-500 mb-1.5">Próximo seguimiento</label>
        <input
          type="date"
          defaultValue={dateValue}
          onChange={(e) => startTransition(() => setFollowUpAt(id, e.target.value))}
          className={inputClass}
        />
        {overdue && <p className="text-yellow-400 text-xs mt-1">Seguimiento vencido</p>}
      </div>

      <p className="label-mono text-gray-500 mb-2">Notas</p>
      {notes.length === 0 && <p className="text-xs text-gray-500 mb-3">Aún no hay notas.</p>}
      <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="liquid-glass rounded-xl p-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm whitespace-pre-line">{note.text}</p>
              <p className="label-mono text-gray-500 mt-1">{formatDate(note.createdAt, true)}</p>
            </div>
            <RemoveButton onClick={() => startTransition(() => deleteNote(note.id))} label="Eliminar nota" />
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Llamó, quedó de mandar referencias, dar seguimiento..."
          rows={2}
          className={`${inputClass} flex-1`}
        />
        <AddButton onClick={handleAddNote} label="Agregar nota" disabled={pending} />
      </div>
    </div>
  );
}
