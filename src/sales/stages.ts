import type { SalesStage } from "@/src/generated/prisma/client";

export interface StageConfig {
  id: SalesStage;
  label: string;
  color: string;
}

/** Column order and styling for the pipeline board — mirrors the SalesStage enum. */
export const stages: StageConfig[] = [
  { id: "new", label: "New", color: "gray" },
  { id: "contacted", label: "Contacted", color: "blue" },
  { id: "qualified", label: "Qualified", color: "violet" },
  { id: "closed", label: "Closed", color: "teal" },
];

export function getStageConfig(stage: SalesStage): StageConfig {
  return stages.find((s) => s.id === stage) ?? stages[0];
}
