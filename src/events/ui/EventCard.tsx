"use client";

import { Box, Divider, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";
import { formatDateRange } from "@/src/core/format";
import { eventsStrings } from "../strings";

export interface EventCardData {
  id: string;
  name: string;
  city: string;
  startDate: Date;
  endDate: Date;
  contactsCount: number;
  companiesCount: number;
}

export function EventCard({
  id,
  name,
  city,
  startDate,
  endDate,
  contactsCount,
  companiesCount,
}: EventCardData) {
  const { card } = eventsStrings;
  const { hovered, ref } = useHover<HTMLAnchorElement>();

  return (
    <Box
      ref={ref}
      component={Link}
      href={`/events/${id}`}
      bd="1px solid var(--mantine-color-gray-3)"
      bdrs="md"
      style={{
        display: "block",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        backgroundColor: hovered ? "var(--mantine-color-gray-0)" : "var(--mantine-color-body)",
        transition: "background-color 120ms ease",
      }}
    >
      <Box p="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap" mb="sm">
          <Text size="xs" fw="bold" tt="uppercase" c="blue" style={{ letterSpacing: 0.6 }}>
            {card.eyebrow}
          </Text>
          <ThemeIcon variant="light" color="blue" size={32} radius="md">
            <IconCalendarEvent size={18} />
          </ThemeIcon>
        </Group>

        <Title order={3} mb="xs" lineClamp={2}>
          {name}
        </Title>

        <Group gap="md">
          <Group gap={6} wrap="nowrap">
            <IconCalendarEvent size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              {formatDateRange(startDate, endDate)}
            </Text>
          </Group>
          <Group gap={6} wrap="nowrap">
            <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              {city}
            </Text>
          </Group>
        </Group>
      </Box>

      <Divider />

      <Group gap={0} wrap="nowrap" px="md" py="sm">
        <Box style={{ flex: 1 }}>
          <Title order={5}>{contactsCount}</Title>
          <Text size="xs" c="dimmed">
            {card.contactsLabel}
          </Text>
        </Box>
        <Divider orientation="vertical" mx="md" />
        <Box style={{ flex: 1 }}>
          <Title order={5}>{companiesCount}</Title>
          <Text size="xs" c="dimmed">
            {card.companiesLabel}
          </Text>
        </Box>
      </Group>
    </Box>
  );
}
