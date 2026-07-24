import { Button } from "@mantine/core";
import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { eventsStrings } from "@/src/events/strings";

export default function EventsCompaniesPage() {
  const { companies } = eventsStrings;

  return (
    <>
      <PageHeader
        breadcrumb={companies.breadcrumb}
        title={companies.title}
        metaItems={companies.metaItems}
        primaryAction={<Button>{companies.primaryAction}</Button>}
        secondaryAction={<Button variant="default">{companies.secondaryAction}</Button>}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
