import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { eventsStrings } from "@/src/events/strings";

export default function EventsPage() {
  const { events } = eventsStrings;

  return (
    <>
      <PageHeader
        breadcrumb={events.breadcrumb}
        title={events.title}
        metaItems={events.metaItems}
        primaryAction={events.primaryAction}
        secondaryAction={events.secondaryAction}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
