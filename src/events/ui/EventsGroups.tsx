import { SimpleGrid, Stack, Text } from "@mantine/core";
import { eventsStrings } from "../strings";
import { EventCard, type EventCardData } from "./EventCard";

interface EventsGroupsProps {
  upcoming: EventCardData[];
  past: EventCardData[];
}

export function EventsGroups({ upcoming, past }: EventsGroupsProps) {
  const { groups } = eventsStrings;

  return (
    <Stack gap="xl">
      {upcoming.length > 0 && (
        <Stack gap="sm">
          <Text fw="bold" size="sm" tt="uppercase" c="dimmed">
            {groups.upcoming}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {upcoming.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {past.length > 0 && (
        <Stack gap="sm">
          <Text fw="bold" size="sm" tt="uppercase" c="dimmed">
            {groups.past}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {past.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
