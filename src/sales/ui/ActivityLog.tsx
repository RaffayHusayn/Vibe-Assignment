"use client";

import { Box, Button, Divider, Paper, Stack, Text, Textarea, Title } from "@mantine/core";
import { useActionState, useEffect, useRef } from "react";
import { addActivity, type ActionState } from "@/src/core/actions/sales";
import { formatDateTime } from "@/src/core/format";
import { salesStrings } from "../strings";

const initialState: ActionState = { ok: false };

export interface ActivityEntry {
  id: string;
  body: string;
  createdAt: Date;
}

export function ActivityLog({
  companyId,
  entries,
}: {
  companyId: string;
  entries: ActivityEntry[];
}) {
  const { activityLog } = salesStrings.detail;
  const [state, formAction, isPending] = useActionState(addActivity, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={4} mb="md">
        {activityLog.title}
      </Title>

      <form ref={formRef} action={formAction}>
        <input type="hidden" name="companyId" value={companyId} />
        <Stack gap="xs">
          <Textarea name="body" placeholder={activityLog.placeholder} rows={2} required />
          {state.error && (
            <Text size="sm" c="red">
              {state.error}
            </Text>
          )}
          <Button type="submit" size="xs" loading={isPending} style={{ alignSelf: "flex-end" }}>
            {activityLog.submit}
          </Button>
        </Stack>
      </form>

      <Divider my="md" />

      {entries.length === 0 ? (
        <Text size="sm" c="dimmed">
          {activityLog.empty}
        </Text>
      ) : (
        <Stack gap="md">
          {entries.map((entry) => (
            <Box key={entry.id}>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {entry.body}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {formatDateTime(entry.createdAt)}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
