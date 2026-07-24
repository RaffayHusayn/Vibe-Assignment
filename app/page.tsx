import { AppShellLayout } from "@/src/core/ui/AppShellLayout";
import { ContentSplit } from "@/src/marketing/ui/ContentSplit";
import { PageHeader } from "@/src/marketing/ui/PageHeader";
import { StatsGrid } from "@/src/marketing/ui/StatsGrid";

export default function Home() {
  return (
    <AppShellLayout>
      <PageHeader />
      <StatsGrid />
      <ContentSplit />
    </AppShellLayout>
  );
}
