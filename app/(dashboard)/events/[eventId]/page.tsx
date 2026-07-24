import { notFound } from "next/navigation";
import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { prisma } from "@/src/core/db";
import { EventDetailHeader } from "@/src/events/ui/EventDetailHeader";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.events_Event.findUnique({ where: { id: eventId } });
  if (!event) notFound();

  return (
    <>
      <EventDetailHeader
        eventId={event.id}
        name={event.name}
        city={event.city}
        startDate={event.startDate}
        endDate={event.endDate}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
