"use client";

import { useTransition } from "react";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS, PIPELINE_STAGE_CLASS, type PipelineStage } from "@/lib/pipeline";

export function StageSelect({
  id,
  stage,
  action,
}: {
  id: string;
  stage: PipelineStage;
  action: (id: string, stage: PipelineStage) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={stage}
      disabled={pending}
      onChange={(e) => startTransition(() => action(id, e.target.value as PipelineStage))}
      className={`text-xs px-2 py-1 rounded-full border-0 outline-none disabled:opacity-50 ${PIPELINE_STAGE_CLASS[stage]}`}
    >
      {PIPELINE_STAGES.map((s) => (
        <option key={s} value={s} className="bg-black text-white">
          {PIPELINE_STAGE_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
