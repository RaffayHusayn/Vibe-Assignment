"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { updateCompanyStage } from "@/src/core/actions/sales";
import type { SalesStage } from "@/src/generated/prisma/client";
import { salesStrings } from "../strings";
import { stages } from "../stages";
import { CompanyCard, CompanyCardContent, type CompanyCardData } from "./CompanyCard";

type GroupedCompanies = Record<string, CompanyCardData[]>;

interface PipelineColumnProps {
  stageId: SalesStage;
  label: string;
  color: string;
  companies: CompanyCardData[];
}

function PipelineColumn({ stageId, label, color, companies }: PipelineColumnProps) {
  const { board } = salesStrings;
  const { setNodeRef, isOver } = useDroppable({ id: stageId });

  return (
    <Box
      ref={setNodeRef}
      miw={280}
      w={280}
      style={{ flexShrink: 0 }}
      bg={isOver ? `${color}.0` : "gray.0"}
      bdrs="md"
      p="sm"
    >
      <Group justify="space-between" mb="sm" px={4}>
        <Group gap={8}>
          <Box w={8} h={8} bdrs="xl" bg={`${color}.5`} />
          <Text size="sm" fw="bold">
            {label}
          </Text>
        </Group>
        <Badge size="sm" variant="light" color={color} circle>
          {companies.length}
        </Badge>
      </Group>

      <Stack gap="xs" mih={60}>
        {companies.length === 0 ? (
          <Text size="xs" c="dimmed" ta="center" py="lg">
            {board.columnEmpty}
          </Text>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id} stage={stageId} {...company} />
          ))
        )}
      </Stack>
    </Box>
  );
}

interface PipelineBoardProps {
  grouped: GroupedCompanies;
}

export function PipelineBoard({ grouped: initialGrouped }: PipelineBoardProps) {
  const [grouped, setGrouped] = useState(initialGrouped);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const activeCompany = activeId
    ? Object.values(grouped)
        .flat()
        .find((company) => company.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const companyId = String(active.id);
    const fromStage = active.data.current?.stage as SalesStage | undefined;
    const toStage = over.id as SalesStage;
    if (!fromStage || fromStage === toStage) return;

    setGrouped((prev) => {
      const company = prev[fromStage]?.find((c) => c.id === companyId);
      if (!company) return prev;
      return {
        ...prev,
        [fromStage]: prev[fromStage].filter((c) => c.id !== companyId),
        [toStage]: [company, ...(prev[toStage] ?? [])],
      };
    });

    updateCompanyStage(companyId, toStage).catch(() => {
      // Persist failed — snap back to where the card started.
      setGrouped((prev) => {
        const company = prev[toStage]?.find((c) => c.id === companyId);
        if (!company) return prev;
        return {
          ...prev,
          [toStage]: prev[toStage].filter((c) => c.id !== companyId),
          [fromStage]: [company, ...(prev[fromStage] ?? [])],
        };
      });
    });
  }

  return (
    <DndContext
      id="sales-pipeline-board"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Group align="flex-start" wrap="nowrap" gap="md" style={{ overflowX: "auto" }} pb="sm">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stageId={stage.id}
            label={stage.label}
            color={stage.color}
            companies={grouped[stage.id] ?? []}
          />
        ))}
      </Group>

      <DragOverlay>
        {activeCompany && (
          <Box
            bd="1px solid var(--mantine-color-gray-3)"
            bdrs="md"
            p="sm"
            w={280}
            bg="var(--mantine-color-body)"
            style={{ boxShadow: "var(--mantine-shadow-md)", cursor: "grabbing" }}
          >
            <CompanyCardContent {...activeCompany} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}
