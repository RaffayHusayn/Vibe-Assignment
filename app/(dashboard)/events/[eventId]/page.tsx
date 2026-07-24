import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { eventsStrings } from "@/src/events/strings";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const { eventDetail } = eventsStrings;

  return (
    <>
      <PageHeader
        breadcrumb={`${eventDetail.breadcrumb} / ${eventId}`}
        title={eventDetail.title}
        metaItems={eventDetail.metaItems}
        primaryAction={eventDetail.primaryAction}
        secondaryAction={eventDetail.secondaryAction}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
