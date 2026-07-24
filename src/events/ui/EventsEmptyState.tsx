import { Box, Stack, Text } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { eventsStrings } from "../strings";
import { CreateEventButton } from "./CreateEventButton";

export function EventsEmptyState() {
  const { emptyState } = eventsStrings;

  return (
    <Box
      bd="2px dashed var(--mantine-color-gray-4)"
      bdrs="md"
      py={80}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Stack align="center" gap={4}>
        <IconCalendarEvent size={32} stroke={1.5} color="var(--mantine-color-dimmed)" />
        <Text fw="medium" mt="xs">
          {emptyState.title}
        </Text>
        <Text size="sm" c="dimmed" ta="center" maw={320}>
          {emptyState.description}
        </Text>
        <Box mt="sm">
          <CreateEventButton label={emptyState.cta} />
        </Box>
      </Stack>
    </Box>
  );
}
