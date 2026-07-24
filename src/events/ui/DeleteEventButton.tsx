import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteEvent } from "@/src/core/actions/events";

export function DeleteEventButton({
  eventId,
  label,
}: {
  eventId: string;
  label: string;
}) {
  return (
    <form action={deleteEvent}>
      <input type="hidden" name="eventId" value={eventId} />
      <Button type="submit" variant="default" leftSection={<IconTrash size={16} />}>
        {label}
      </Button>
    </form>
  );
}
