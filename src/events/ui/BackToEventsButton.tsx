"use client";

import { Anchor, Group, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export function BackToEventsButton({ label }: { label: string }) {
  return (
    <Anchor component={Link} href="/events" underline="never" c="dimmed">
      <Group gap={4} wrap="nowrap">
        <IconArrowLeft size={14} stroke={1.5} />
        <Text size="sm">{label}</Text>
      </Group>
    </Anchor>
  );
}
