"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconCheck, IconMail, IconSparkles } from "@tabler/icons-react";
import { useActionState, useMemo, useState, useTransition } from "react";
import {
  addActivity,
  generateEmailDraft,
  type GenerateEmailState,
} from "@/src/core/actions/sales";
import { salesStrings } from "../strings";
import type { ContactWithTouchpoints } from "./CompanyContactsList";

const initialState: GenerateEmailState = { ok: false };

export function EmailDraftGenerator({
  companyId,
  contacts,
}: {
  companyId: string;
  contacts: ContactWithTouchpoints[];
}) {
  const { emailGenerator } = salesStrings.detail;
  const [state, formAction, isPending] = useActionState(generateEmailDraft, initialState);

  const [contactId, setContactId] = useState<string | null>(contacts[0]?.id ?? null);
  const [includeTouchpoints, setIncludeTouchpoints] = useState(true);

  const [isLogging, startLogging] = useTransition();
  const [logged, setLogged] = useState(false);

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === contactId) ?? null,
    [contacts, contactId],
  );
  const touchpointCount = selectedContact?.touchpoints.length ?? 0;

  function handleLogActivity() {
    if (!state.draft) return;
    const body = `Drafted email — ${state.draft.subject}\n\n${state.draft.body}`;
    const form = new FormData();
    form.set("companyId", companyId);
    form.set("body", body);
    startLogging(async () => {
      await addActivity({ ok: false }, form);
      setLogged(true);
    });
  }

  if (contacts.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4} mb="xs">
          {emailGenerator.title}
        </Title>
        <Text size="sm" c="dimmed">
          {emailGenerator.noContacts}
        </Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="lg">
      <Group gap={8} mb="md">
        <IconSparkles size={18} color="var(--mantine-color-blue-6)" />
        <Title order={4}>{emailGenerator.title}</Title>
      </Group>

      <form
        action={formAction}
        onSubmit={() => setLogged(false)}
      >
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="contactId" value={contactId ?? ""} />

        <Stack gap="sm">
          <Select
            label={emailGenerator.recipientLabel}
            placeholder={emailGenerator.recipientPlaceholder}
            data={contacts.map((c) => ({
              value: c.id,
              label: c.name ? `${c.name} (${c.email})` : c.email,
            }))}
            value={contactId}
            onChange={setContactId}
            allowDeselect={false}
          />

          <Switch
            name="includeTouchpoints"
            label={emailGenerator.includeTouchpointsLabel}
            checked={includeTouchpoints && touchpointCount > 0}
            disabled={touchpointCount === 0}
            description={touchpointCount === 0 ? emailGenerator.noTouchpoints : undefined}
            onChange={(event) => setIncludeTouchpoints(event.currentTarget.checked)}
          />

          <Textarea
            name="instructions"
            label={emailGenerator.instructionsLabel}
            placeholder={emailGenerator.instructionsPlaceholder}
            rows={3}
          />

          {state.error && (
            <Text size="sm" c="red">
              {state.error}
            </Text>
          )}

          <Button
            type="submit"
            loading={isPending}
            disabled={!contactId}
            leftSection={<IconMail size={16} />}
          >
            {state.draft ? emailGenerator.regenerate : emailGenerator.submit}
          </Button>
        </Stack>
      </form>

      {state.ok && state.draft && (
        <>
          <Divider my="md" />
          <Stack gap="sm">
            <Box>
              <Text size="xs" c="dimmed">
                {emailGenerator.subjectLabel}
              </Text>
              <Text size="sm" fw="medium">
                {state.draft.subject}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {emailGenerator.bodyLabel}
              </Text>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {state.draft.body}
              </Text>
            </Box>

            {logged ? (
              <Badge
                variant="light"
                color="teal"
                leftSection={<IconCheck size={12} />}
                style={{ alignSelf: "flex-start" }}
              >
                {emailGenerator.logged}
              </Badge>
            ) : (
              <Button
                variant="light"
                size="xs"
                loading={isLogging}
                onClick={handleLogActivity}
                style={{ alignSelf: "flex-start" }}
              >
                {emailGenerator.logAction}
              </Button>
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
}
