"use client";

import { PIPELINE_STAGE_CLASS, PIPELINE_STAGE_LABELS, type PipelineStage } from "@/lib/pipeline";

export function formatDate(value: string | Date, withTime = false) {
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
    timeZone: "America/Mexico_City",
  });
}

export function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span className={`text-xs px-3 py-1 rounded-full ${PIPELINE_STAGE_CLASS[stage]}`}>
      {PIPELINE_STAGE_LABELS[stage]}
    </span>
  );
}

export function isOverdue(followUpAt: string | Date | null) {
  return !!followUpAt && new Date(followUpAt) < new Date();
}

/** Clickable summary card for leads, requests, and proposals — opens a detail pop-up. */
export function RecordCard({
  onClick,
  unread,
  title,
  subtitle,
  badge,
  body,
  footer,
}: {
  onClick: () => void;
  unread?: boolean;
  title: string;
  subtitle?: string | null;
  badge?: React.ReactNode;
  body?: string | null;
  footer?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="liquid-glass rounded-2xl p-5 text-left flex flex-col gap-3 hover:bg-white/5 hover:ring-1 hover:ring-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium flex items-center gap-2">
            {unread && <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" aria-label="Sin leer" />}
            <span className="truncate">{title}</span>
          </p>
          {subtitle && <p className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</p>}
        </div>
        {badge}
      </div>
      {body && <p className="text-sm text-gray-400 line-clamp-3">{body}</p>}
      {footer && <div className="label-mono text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-auto">{footer}</div>}
    </button>
  );
}

export function CardGrid({ children, empty, isEmpty }: { children: React.ReactNode; empty: string; isEmpty: boolean }) {
  if (isEmpty) return <p className="liquid-glass rounded-2xl p-6 text-sm text-gray-500">{empty}</p>;
  return <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>;
}

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-mono text-gray-500 mb-1">{label}</p>
      <div className="text-sm text-gray-200">{children}</div>
    </div>
  );
}
