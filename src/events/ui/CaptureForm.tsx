"use client";

import {
  Alert,
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Progress,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconChevronDown, IconMail } from "@tabler/icons-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { captureContact, type CaptureContactState } from "@/src/core/actions/contacts";
import { companyFromDomain, domainFromEmail, nameFromEmail } from "@/src/core/utils/extract";
import { isValidEmail } from "@/src/core/utils/validation";
import { eventsStrings } from "../strings";
import { ExtractedCard } from "./ExtractedCard";

const initialState: CaptureContactState = { ok: false };

export function CaptureForm({ eventId }: { eventId: string }) {
  const { captureContact: strings } = eventsStrings;
  const [state, formAction, isPending] = useActionState(captureContact, initialState);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const lastHandled = useRef<CaptureContactState["contact"]>(undefined);

  const [email, setEmail] = useState("");
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [companyOverride, setCompanyOverride] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");

  const emailValid = isValidEmail(email);
  const domain = domainFromEmail(email);
  const name = nameOverride ?? nameFromEmail(email) ?? "";
  const company = companyOverride ?? companyFromDomain(domain) ?? "";

  const score = [emailValid, name.length > 0, company.length > 0, role.trim().length > 0, note.trim().length > 0]
    .filter(Boolean).length;
  const strengthColor = score <= 1 ? "red" : score <= 3 ? "yellow" : "teal";
  const helperText = !emailValid
    ? strings.strength.needEmail
    : !name
      ? strings.strength.needName
      : !company
        ? strings.strength.needCompany
        : !role.trim()
          ? strings.strength.needRole
          : !note.trim()
            ? strings.strength.needNote
            : strings.strength.complete;

  // The form stays put and clears itself the instant a capture lands, ready
  // for the next person at the booth — the confirmation lives in the banner
  // below, not in a screen the form disappears behind.
  useEffect(() => {
    if (state.ok && state.contact && state.contact !== lastHandled.current) {
      lastHandled.current = state.contact;
      setEmail("");
      setNameOverride(null);
      setCompanyOverride(null);
      setRole("");
      setNote("");
      emailInputRef.current?.focus();
    }
  }, [state]);

  return (
    <Stack gap="md">
      <form action={formAction}>
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="company" value={company} />

        <Grid gap="xl">
          <GridCol span={{ base: 12, md: 6 }}>
            {/* Capped so the badge stays badge-sized (like a physical card) instead of
                stretching to fill a wide grid column. */}
            <Stack gap="xs" style={{ maxWidth: 420, marginInline: "auto" }}>
              <TextInput
                label={strings.emailLabel}
                placeholder={strings.emailPlaceholder}
                name="email"
                ref={emailInputRef}
                leftSection={<IconMail size={16} />}
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                error={email.length > 0 && !emailValid ? strings.emailError : undefined}
                required
              />

              <Stack align="center" gap={0} py={4}>
                <Box style={{ width: 1, height: 20, background: "var(--mantine-color-gray-4)" }} />
                <IconChevronDown size={16} color="var(--mantine-color-gray-5)" />
              </Stack>

              <ExtractedCard
                email={email}
                emailValid={emailValid}
                name={name}
                company={company}
                onNameChange={setNameOverride}
                onCompanyChange={setCompanyOverride}
              />
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Stack gap="md" justify="space-between" style={{ height: "100%" }}>
              <Stack gap="md">
                <TextInput
                  label={strings.roleLabel}
                  placeholder={strings.rolePlaceholder}
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.currentTarget.value)}
                />
                <Textarea
                  label={strings.noteLabel}
                  placeholder={strings.notePlaceholder}
                  name="note"
                  rows={6}
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                />

                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={500}>
                      {strings.strength.label}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {score}/5
                    </Text>
                  </Group>
                  <Progress value={(score / 5) * 100} color={strengthColor} size="lg" radius="xl" />
                  <Text size="xs" c="dimmed" mt={6}>
                    {helperText}
                  </Text>
                </Box>
              </Stack>

              <Stack gap="sm">
                {state.error && (
                  <Text size="sm" c="red">
                    {state.error}
                  </Text>
                )}
                <Button type="submit" loading={isPending} disabled={!emailValid} fullWidth size="md">
                  {strings.submit}
                </Button>
              </Stack>
            </Stack>
          </GridCol>
        </Grid>
      </form>

      {state.ok && state.contact && (
        <Alert icon={<IconCheck size={16} />} color="teal" variant="light" radius="md">
          <Text size="sm">
            <Text component="span" fw={700}>
              {state.contact.name || state.contact.email}
            </Text>{" "}
            {strings.banner.addedSuffix}
            {state.contact.company && (
              <>
                {" · "}
                {strings.banner.resolvedTo}{" "}
                <Text component="span" fw={700}>
                  {state.contact.company}
                </Text>
              </>
            )}
          </Text>
        </Alert>
      )}
    </Stack>
  );
}
