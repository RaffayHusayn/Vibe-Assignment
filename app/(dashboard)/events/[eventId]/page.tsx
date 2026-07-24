import { Divider, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import { prisma } from "@/src/core/db";
import { CaptureForm } from "@/src/events/ui/CaptureForm";
import { CapturedAttendeesTable } from "@/src/events/ui/CapturedAttendeesTable";
import { EventDetailHeader } from "@/src/events/ui/EventDetailHeader";
import { eventsStrings } from "@/src/events/strings";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.events_Event.findUnique({
    where: { id: eventId },
    include: {
      touchpoints: {
        orderBy: { createdAt: "desc" },
        include: { contact: { include: { company: true } } },
      },
    },
  });
  if (!event) notFound();

  const { captureContact: strings } = eventsStrings;

  return (
    <>
      <EventDetailHeader
        eventId={event.id}
        name={event.name}
        city={event.city}
        startDate={event.startDate}
        endDate={event.endDate}
      />
      <Title order={3} mb="md">
        {strings.title}
      </Title>
      <CaptureForm eventId={event.id} />

      <Divider my="xl" />

      <Title order={4} mb="md">
        {strings.roster.heading} ({event.touchpoints.length})
      </Title>
      <CapturedAttendeesTable
        eventId={event.id}
        attendees={event.touchpoints.map((tp) => ({
          touchpointId: tp.id,
          createdAt: tp.createdAt,
          note: tp.note,
          contactName: tp.contact.name,
          contactEmail: tp.contact.email,
          contactTitle: tp.contact.title,
          companyName: tp.contact.company.name,
          companyDomain: tp.contact.company.domain,
        }))}
      />
    </>
  );
}
