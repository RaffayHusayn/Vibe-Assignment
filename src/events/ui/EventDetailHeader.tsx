import { Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react";
import { formatDateRange } from "@/src/core/format";
import { eventsStrings } from "../strings";
import { BackToEventsButton } from "./BackToEventsButton";
import { DeleteEventButton } from "./DeleteEventButton";

interface EventDetailHeaderProps {
  eventId: string;
  name: string;
  city: string;
  startDate: Date;
  endDate: Date;
}

export function EventDetailHeader({
  eventId,
  name,
  city,
  startDate,
  endDate,
}: EventDetailHeaderProps) {
  const { eventDetail, card } = eventsStrings;

  return (
    <Box mb="xl">
      <BackToEventsButton label={eventDetail.backLabel} />

      <Divider my="md" style={{ marginInline: "calc(var(--mantine-spacing-xl) * -1)" }} />

      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        <Stack gap={6}>
          <Text size="xs" tt="uppercase" c="dimmed">
            {card.eyebrow}
          </Text>
          <Title order={1}>{name}</Title>
          <Group gap="md">
            <Group gap={6} wrap="nowrap">
              <IconCalendarEvent size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">
                {formatDateRange(startDate, endDate)}
              </Text>
            </Group>
            <Group gap={6} wrap="nowrap">
              <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">
                {city}
              </Text>
            </Group>
          </Group>
        </Stack>

        <DeleteEventButton eventId={eventId} label={eventDetail.deleteAction} />
      </Group>

      <Divider style={{ marginInline: "calc(var(--mantine-spacing-xl) * -1)" }} />
    </Box>
  );
}
