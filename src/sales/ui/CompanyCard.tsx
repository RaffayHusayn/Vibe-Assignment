"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge, Box, Group, Text, ThemeIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconBuilding, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { salesStrings } from "../strings";
import type { SalesStage } from "@/src/generated/prisma/client";

export interface CompanyCardData {
  id: string;
  name: string;
  domain: string;
  industry: string | null;
  metaLabel: string | null;
  contactsCount: number;
  enrichmentStatus: "pending" | "enriched" | "failed";
}

/** Pure visual content, reused by the card itself and the drag overlay preview. */
export function CompanyCardContent({
  name,
  domain,
  industry,
  metaLabel,
  contactsCount,
  enrichmentStatus,
}: CompanyCardData) {
  const { board } = salesStrings;

  return (
    <>
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb={6}>
        <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
          <ThemeIcon variant="light" color="gray" size={28} radius="sm" style={{ flexShrink: 0 }}>
            <IconBuilding size={16} />
          </ThemeIcon>
          <Box style={{ minWidth: 0 }}>
            <Text size="sm" fw="medium" lineClamp={1}>
              {name}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {domain}
            </Text>
          </Box>
        </Group>
        {enrichmentStatus !== "enriched" && (
          <Badge
            size="xs"
            variant="light"
            color={enrichmentStatus === "failed" ? "red" : "gray"}
            style={{ flexShrink: 0 }}
          >
            {enrichmentStatus === "failed" ? board.failedBadge : board.pendingBadge}
          </Badge>
        )}
      </Group>

      {(industry || metaLabel) && (
        <Group gap={6} mb={6}>
          {industry && (
            <Badge size="xs" variant="outline" color="gray" tt="none" fw="normal">
              {industry}
            </Badge>
          )}
          {metaLabel && (
            <Text size="xs" c="dimmed">
              {metaLabel}
            </Text>
          )}
        </Group>
      )}

      <Group gap={4}>
        <IconUsers size={12} color="var(--mantine-color-dimmed)" />
        <Text size="xs" c="dimmed">
          {board.contactsLabel(contactsCount)}
        </Text>
      </Group>
    </>
  );
}

interface CompanyCardProps extends CompanyCardData {
  stage: SalesStage;
}

/** Draggable, clickable card. Dragging moves it between pipeline stages; a plain
 * click (no meaningful pointer movement) navigates to the company detail page. */
export function CompanyCard(props: CompanyCardProps) {
  const { id, stage, ...content } = props;
  const router = useRouter();
  const { hovered, ref: setHoverRef } = useHover<HTMLDivElement>();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { stage },
  });

  return (
    <Box
      ref={(node) => {
        setNodeRef(node);
        setHoverRef(node);
      }}
      {...listeners}
      {...attributes}
      onClick={() => router.push(`/sales/${id}`)}
      bd="1px solid var(--mantine-color-gray-3)"
      bdrs="md"
      p="sm"
      style={{
        cursor: isDragging ? "grabbing" : "pointer",
        touchAction: "none",
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        backgroundColor: hovered ? "var(--mantine-color-gray-0)" : "var(--mantine-color-body)",
        transition: isDragging ? undefined : "background-color 120ms ease",
        zIndex: isDragging ? 1 : undefined,
        position: "relative",
      }}
    >
      <CompanyCardContent id={id} {...content} />
    </Box>
  );
}
