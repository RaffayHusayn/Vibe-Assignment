import {
  Box,
  Button,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import { IconTrash, IconUsers } from "@tabler/icons-react";
import { formatDateTime } from "@/src/core/format";
import { deleteTouchpoint } from "@/src/core/actions/contacts";
import { eventsStrings } from "../strings";

export interface CapturedAttendeeRow {
  touchpointId: string;
  createdAt: Date;
  note: string;
  contactName: string | null;
  contactEmail: string;
  contactTitle: string | null;
  companyName: string | null;
  companyDomain: string;
}

export function CapturedAttendeesTable({
  eventId,
  attendees,
}: {
  eventId: string;
  attendees: CapturedAttendeeRow[];
}) {
  const { roster } = eventsStrings.captureContact;

  if (attendees.length === 0) {
    return (
      <Box
        bd="2px dashed var(--mantine-color-gray-4)"
        bdrs="md"
        py={40}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Stack align="center" gap={4}>
          <IconUsers size={28} stroke={1.5} color="var(--mantine-color-dimmed)" />
          <Text fw="medium" mt="xs">
            {roster.emptyTitle}
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={320}>
            {roster.emptyDescription}
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <TableScrollContainer minWidth={640}>
      <Table verticalSpacing="sm">
        <TableThead>
          <TableTr>
            <TableTh>{roster.columnAttendee}</TableTh>
            <TableTh>{roster.columnRole}</TableTh>
            <TableTh>{roster.columnCompany}</TableTh>
            <TableTh>{roster.columnCaptured}</TableTh>
            <TableTh />
          </TableTr>
        </TableThead>
        <TableTbody>
          {attendees.map((row) => (
            <TableTr key={row.touchpointId}>
              <TableTd>
                <Text size="sm" fw={500}>
                  {row.contactName || row.contactEmail}
                </Text>
                <Text size="xs" c="dimmed">
                  {row.contactEmail}
                  {row.note ? ` · ${row.note}` : ""}
                </Text>
              </TableTd>
              <TableTd>
                <Text size="sm" c={row.contactTitle ? undefined : "dimmed"}>
                  {row.contactTitle ?? "—"}
                </Text>
              </TableTd>
              <TableTd>
                <Text size="sm">{row.companyName ?? row.companyDomain}</Text>
                <Text size="xs" c="dimmed" ff="monospace">
                  {row.companyDomain}
                </Text>
              </TableTd>
              <TableTd>
                <Text size="sm" c="dimmed">
                  {formatDateTime(row.createdAt)}
                </Text>
              </TableTd>
              <TableTd>
                <form action={deleteTouchpoint}>
                  <input type="hidden" name="touchpointId" value={row.touchpointId} />
                  <input type="hidden" name="eventId" value={eventId} />
                  <Button
                    type="submit"
                    variant="subtle"
                    color="red"
                    size="xs"
                    leftSection={<IconTrash size={14} />}
                  >
                    {roster.removeAction}
                  </Button>
                </form>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </TableScrollContainer>
  );
}
