"use client";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useActionState, useState } from "react";
import { createEvent, type ActionState } from "@/src/core/actions/events";
import { eventsStrings } from "../strings";

const initialState: ActionState = { ok: false };

export function CreateEventButton({ label }: { label: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(createEvent, initialState);
  const { createEvent: strings } = eventsStrings;

  return (
    <>
      <Button onClick={open}>{label}</Button>
      <Modal opened={opened} onClose={close} title={strings.modalTitle} centered>
        <form action={formAction}>
          <Stack gap="sm">
            <TextInput
              label={strings.nameLabel}
              placeholder={strings.namePlaceholder}
              name="name"
              required
            />
            <TextInput
              label={strings.cityLabel}
              placeholder={strings.cityPlaceholder}
              name="city"
              required
            />
            <Group grow>
              <DateInput
                label={strings.startDateLabel}
                value={startDate}
                onChange={(value) => setStartDate(value)}
                required
              />
              <DateInput
                label={strings.endDateLabel}
                value={endDate}
                onChange={(value) => setEndDate(value)}
                required
              />
            </Group>
            <input type="hidden" name="startDate" value={startDate ?? ""} />
            <input type="hidden" name="endDate" value={endDate ?? ""} />

            {state.error && (
              <Text size="sm" c="red">
                {state.error}
              </Text>
            )}

            <Button type="submit" loading={isPending} fullWidth>
              {strings.submit}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
