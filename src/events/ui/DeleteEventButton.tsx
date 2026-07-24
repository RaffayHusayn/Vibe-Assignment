"use client";

import { Button, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useActionState } from "react";
import { deleteEvent, type ActionState } from "@/src/core/actions/events";

const initialState: ActionState = { ok: false };

export function DeleteEventButton({
  eventId,
  label,
}: {
  eventId: string;
  label: string;
}) {
  const [state, formAction, isPending] = useActionState(deleteEvent, initialState);

  return (
    <Stack gap={4} align="flex-end">
      <form action={formAction}>
        <input type="hidden" name="eventId" value={eventId} />
        <Button type="submit" variant="default" leftSection={<IconTrash size={16} />} loading={isPending}>
          {label}
        </Button>
      </form>
      {state.error && (
        <Text size="xs" c="red" ta="right" maw={220}>
          {state.error}
        </Text>
      )}
    </Stack>
  );
}
