import { Button } from "@mantine/core";
import { ContentSplit } from "@/src/core/ui/ContentSplit";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { StatsGrid } from "@/src/core/ui/StatsGrid";
import { salesStrings } from "@/src/sales/strings";

export default function SalesCompaniesPage() {
  const { companies } = salesStrings;

  return (
    <>
      <PageHeader
        breadcrumb={companies.breadcrumb}
        title={companies.title}
        metaItems={companies.metaItems}
        primaryAction={<Button>{companies.primaryAction}</Button>}
      />
      <StatsGrid />
      <ContentSplit />
    </>
  );
}
