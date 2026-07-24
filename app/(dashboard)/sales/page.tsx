import { Button } from "@mantine/core";
import { prisma } from "@/src/core/db";
import { formatCompactCurrency } from "@/src/core/format";
import { PageHeader } from "@/src/core/ui/PageHeader";
import { salesStrings } from "@/src/sales/strings";
import { stages } from "@/src/sales/stages";
import { PipelineBoard } from "@/src/sales/ui/PipelineBoard";
import type { CompanyCardData } from "@/src/sales/ui/CompanyCard";

export const dynamic = "force-dynamic";

export default async function SalesCompaniesPage() {
  const { companies: strings } = salesStrings;

  const companies = await prisma.core_Company.findMany({
    include: { pipeline: true, _count: { select: { contacts: true } } },
    orderBy: { createdAt: "desc" },
  });

  const grouped: Record<string, CompanyCardData[]> = Object.fromEntries(
    stages.map((stage) => [stage.id, []]),
  );

  for (const company of companies) {
    const stageId = company.pipeline?.stage ?? "new";
    grouped[stageId].push({
      id: company.id,
      name: company.name ?? company.domain,
      domain: company.domain,
      industry: company.industry,
      metaLabel: company.employeeCount
        ? `${company.employeeCount.toLocaleString()} employees`
        : formatCompactCurrency(company.revenue)
          ? `${formatCompactCurrency(company.revenue)} rev`
          : null,
      contactsCount: company._count.contacts,
      enrichmentStatus: company.enrichmentStatus,
    });
  }

  const wonCount = grouped.closed?.length ?? 0;
  const inPipelineCount = companies.length - wonCount;
  const metaItems = [
    `${companies.length} compan${companies.length === 1 ? "y" : "ies"}`,
    `${inPipelineCount} in pipeline`,
    `${wonCount} won`,
  ];

  return (
    <>
      <PageHeader
        breadcrumb={strings.breadcrumb}
        title={strings.title}
        metaItems={metaItems}
        primaryAction={<Button>{strings.primaryAction}</Button>}
      />
      <PipelineBoard grouped={grouped} />
    </>
  );
}
