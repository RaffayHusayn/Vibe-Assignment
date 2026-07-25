"use client";

import { SegmentedControl, type MantineSize } from "@mantine/core";
import { useState, useTransition } from "react";
import { updateCompanyStage } from "@/src/core/actions/sales";
import type { SalesStage } from "@/src/generated/prisma/client";
import { getStageConfig, stages } from "../stages";

interface StageToggleProps {
  companyId: string;
  stage: SalesStage;
  size?: MantineSize;
}

export function StageToggle({ companyId, stage, size = "xs" }: StageToggleProps) {
  const [value, setValue] = useState<SalesStage>(stage);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    const nextStage = next as SalesStage;
    const previous = value;
    setValue(nextStage);

    startTransition(async () => {
      try {
        await updateCompanyStage(companyId, nextStage);
      } catch {
        setValue(previous);
      }
    });
  }

  return (
    <SegmentedControl
      size={size}
      value={value}
      onChange={handleChange}
      disabled={isPending}
      color={getStageConfig(value).color}
      data={stages.map((s) => ({ label: s.label, value: s.id }))}
    />
  );
}
