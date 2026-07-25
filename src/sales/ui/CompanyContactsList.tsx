import { Badge, Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { formatDateTime } from "@/src/core/format";
import { salesStrings } from "../strings";

export interface ContactTouchpoint {
  id: string;
  note: string;
  createdAt: Date;
  eventName: string;
}

export interface ContactWithTouchpoints {
  id: string;
  name: string | null;
  email: string;
  title: string | null;
  verified: boolean;
  touchpoints: ContactTouchpoint[];
}

export function CompanyContactsList({ contacts }: { contacts: ContactWithTouchpoints[] }) {
  const { contactsPanel } = salesStrings.detail;

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={4} mb="md">
        {contactsPanel.title} ({contacts.length})
      </Title>

      {contacts.length === 0 ? (
        <Text size="sm" c="dimmed">
          {contactsPanel.empty}
        </Text>
      ) : (
        <Stack gap="md">
          {contacts.map((contact) => (
            <Box
              key={contact.id}
              bd="1px solid var(--mantine-color-gray-3)"
              bdrs="md"
              p="md"
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Box>
                  <Text size="sm" fw="bold">
                    {contact.name || contact.email}
                  </Text>
                  <Text size="xs">{contact.title ?? "—"}</Text>
                  <Text size="xs">{contact.email}</Text>
                </Box>
                {contact.verified && (
                  <Badge size="xs" variant="light" color="teal" style={{ flexShrink: 0 }}>
                    {contactsPanel.verified}
                  </Badge>
                )}
              </Group>

              {contact.touchpoints.some((tp) => tp.note) && (
                <Stack gap={6} mt="sm">
                  {contact.touchpoints
                    .map((tp) => (
                      <Box key={tp.id} bg="gray.0" bdrs="sm" p={8}>
                        <Text size="xs" c="dimmed">
                          {tp.eventName} · {formatDateTime(tp.createdAt)}
                        </Text>
                        {tp.note &&
                          (<Text size="xs" mt={2}>
                            {tp.note}
                          </Text>)
                        }
                      </Box>
                    ))}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
