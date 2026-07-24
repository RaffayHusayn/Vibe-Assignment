import { PageHeader } from "@/src/core/ui/PageHeader";
import { prisma } from "@/src/core/db";
import { CreateEventButton } from "@/src/events/ui/CreateEventButton";
import { EventsEmptyState } from "@/src/events/ui/EventsEmptyState";
import { EventsGroups } from "@/src/events/ui/EventsGroups";
import { eventsStrings } from "@/src/events/strings";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { events } = eventsStrings;

  const allEvents = await prisma.events_Event.findMany({
    orderBy: { startDate: "desc" },
    include: {
      touchpoints: {
        select: { contact: { select: { companyId: true } } },
      },
    },
  });

  const eventsWithCounts = allEvents.map((event) => ({
    id: event.id,
    name: event.name,
    city: event.city,
    startDate: event.startDate,
    endDate: event.endDate,
    contactsCount: event.touchpoints.length,
    companiesCount: new Set(event.touchpoints.map((tp) => tp.contact.companyId)).size,
  }));

  const now = new Date();
  const upcoming = eventsWithCounts.filter((event) => event.endDate >= now);
  const past = eventsWithCounts.filter((event) => event.endDate < now);

  const metaItems = [
    `${allEvents.length} ${events.metaLabels.total}`,
    `${upcoming.length} ${events.metaLabels.upcoming}`,
    `${past.length} ${events.metaLabels.past}`,
  ];

  return (
    <>
      <PageHeader
        breadcrumb={events.breadcrumb}
        title={events.title}
        metaItems={metaItems}
        primaryAction={<CreateEventButton label={events.primaryAction} />}
      />
      {allEvents.length === 0 ? (
        <EventsEmptyState />
      ) : (
        <EventsGroups upcoming={upcoming} past={past} />
      )}
    </>
  );
}
