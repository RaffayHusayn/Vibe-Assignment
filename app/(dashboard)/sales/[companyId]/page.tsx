import { Grid, GridCol, Stack } from "@mantine/core";
import { notFound } from "next/navigation";
import { prisma } from "@/src/core/db";
import { formatCompactCurrency } from "@/src/core/format";
import { ActivityLog } from "@/src/sales/ui/ActivityLog";
import { CompanyContactsList } from "@/src/sales/ui/CompanyContactsList";
import { CompanyDetailHeader } from "@/src/sales/ui/CompanyDetailHeader";
import { CompanyInfoPanel } from "@/src/sales/ui/CompanyInfoPanel";
import { EmailDraftGenerator } from "@/src/sales/ui/EmailDraftGenerator";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const company = await prisma.core_Company.findUnique({
    where: { id: companyId },
    include: {
      pipeline: { include: { activityTimeline: { orderBy: { createdAt: "desc" } } } },
      contacts: {
        include: { touchpoints: { include: { event: true }, orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!company) notFound();

  const contacts = company.contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    title: contact.title,
    verified: contact.verified,
    touchpoints: contact.touchpoints.map((tp) => ({
      id: tp.id,
      note: tp.note,
      createdAt: tp.createdAt,
      eventName: tp.event.name,
    })),
  }));

  return (
    <>
      <CompanyDetailHeader
        companyId={company.id}
        name={company.name ?? company.domain}
        domain={company.domain}
        stage={company.pipeline?.stage ?? "new"}
        employeeCount={company.employeeCount}
        revenueLabel={formatCompactCurrency(company.revenue)}
        contactsCount={contacts.length}
        enrichmentStatus={company.enrichmentStatus}
      />

      <Grid gap="xl">
        <GridCol span={{ base: 12, md: 8 }}>
          <Stack gap="xl">
            <CompanyInfoPanel
              industry={company.industry}
              employeeCount={company.employeeCount}
              revenue={company.revenue}
              totalFunding={company.totalFunding}
              lastFundingAt={company.lastFundingAt}
              growth6mo={company.growth6mo}
              growth12mo={company.growth12mo}
              growth24mo={company.growth24mo}
              techStack={company.techStack}
              deptHeadcount={company.deptHeadcount}
              enrichmentStatus={company.enrichmentStatus}
            />
            <CompanyContactsList contacts={contacts} />
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          <Stack gap="xl">
            <EmailDraftGenerator companyId={company.id} contacts={contacts} />
            <ActivityLog companyId={company.id} entries={company.pipeline?.activityTimeline ?? []} />
          </Stack>
        </GridCol>
      </Grid>
    </>
  );
}
