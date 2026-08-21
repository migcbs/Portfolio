export const PIPELINE_STAGES = ["NEW", "CONTACTED", "QUOTE_SENT", "WON", "LOST"] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUOTE_SENT: "Cotización enviada",
  WON: "Ganado",
  LOST: "Perdido",
};

export const PIPELINE_STAGE_CLASS: Record<PipelineStage, string> = {
  NEW: "bg-white/10 text-gray-300",
  CONTACTED: "bg-blue-500/20 text-blue-300",
  QUOTE_SENT: "bg-yellow-500/20 text-yellow-300",
  WON: "bg-green-500/20 text-green-400",
  LOST: "bg-red-500/20 text-red-400",
};
