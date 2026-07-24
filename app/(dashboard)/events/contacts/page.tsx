import { Button } from "@mantine/core";
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
        primaryAction={<Button>{contacts.primaryAction}</Button>}
        secondaryAction={<Button variant="default">{contacts.secondaryAction}</Button>}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
