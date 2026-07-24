import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { eventsStrings } from "@/src/events/strings";

export default function ContactsPage() {
  const { contacts } = eventsStrings;

  return (
    <>
      <PageHeader
        breadcrumb={contacts.breadcrumb}
        title={contacts.title}
        metaItems={contacts.metaItems}
        primaryAction={contacts.primaryAction}
        secondaryAction={contacts.secondaryAction}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
