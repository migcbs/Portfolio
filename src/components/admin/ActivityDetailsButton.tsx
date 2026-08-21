"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/admin/Modal";

type NoteItem = { id: string; text: string; createdAt: string | Date };

export function ActivityDetailsButton({
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
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [text, setText] = useState("");
  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  const dateValue = followUpAt ? new Date(followUpAt).toISOString().slice(0, 10) : "";
  const overdue = followUpAt && new Date(followUpAt) < new Date();

  function handleAddNote() {
    if (!text.trim()) return;
    const fd = new FormData();
    fd.set("text", text);
    startTransition(() => addNote(id, fd));
    setText("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-sm hover:text-gray-300 ${overdue ? "text-yellow-400" : ""}`}
      >
        {notes.length > 0 ? `Notas (${notes.length})` : "Notas"}
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="liquid-glass rounded-2xl p-6 max-w-xl">
          <h2 className="text-lg font-medium mb-4">Seguimiento</h2>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1.5">Próximo seguimiento</label>
            <input
              type="date"
              defaultValue={dateValue}
              onChange={(e) => startTransition(() => setFollowUpAt(id, e.target.value))}
              className={inputClass}
            />
            {overdue && <p className="text-yellow-400 text-xs mt-1">Seguimiento vencido</p>}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Notas</p>
            {notes.length === 0 && <p className="text-xs text-gray-500 mb-3">Aún no hay notas.</p>}
            <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="liquid-glass rounded-xl p-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm whitespace-pre-line">{note.text}</p>
                    <p className="label-mono text-gray-500 mt-1">
                      {new Date(note.createdAt).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startTransition(() => deleteNote(note.id))}
                    aria-label="Eliminar nota"
                    className="text-gray-500 hover:text-red-400 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Llamó, quedó de mandar referencias, dar seguimiento..."
                rows={2}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="bg-white text-black rounded-xl font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors shrink-0 self-start"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
