import { Badge, Box, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { formatCompactCurrency, formatDate } from "@/src/core/format";
import { salesStrings } from "../strings";

interface CompanyInfoPanelProps {
  industry: string | null;
  employeeCount: number | null;
  revenue: bigint | null;
  totalFunding: bigint | null;
  lastFundingAt: Date | null;
  growth6mo: number | null;
  growth12mo: number | null;
  growth24mo: number | null;
  techStack: string[];
  deptHeadcount: unknown;
  enrichmentStatus: "enriched" | "failed";
}

function pct(value: number | null): string {
  return value == null ? "—" : `${value >= 0 ? "+" : ""}${Math.round(value * 100)}%`;
}

/** deptHeadcount is a Json field from Apollo with no enforced shape — only trust
 * it when it's a flat object of department name -> headcount. */
function parseDeptHeadcount(value: unknown): [string, number][] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );
  return entries.length > 0 ? entries.sort((a, b) => b[1] - a[1]) : null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
}

export function CompanyInfoPanel({
  industry,
  employeeCount,
  revenue,
  totalFunding,
  lastFundingAt,
  growth6mo,
  growth12mo,
  growth24mo,
  techStack,
  deptHeadcount,
  enrichmentStatus,
}: CompanyInfoPanelProps) {
  const { infoPanel } = salesStrings.detail;
  const empty = infoPanel.empty;
  const departments = parseDeptHeadcount(deptHeadcount);
  const maxDeptCount = departments ? Math.max(...departments.map(([, count]) => count)) : 0;

  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <Title order={4}>{infoPanel.title}</Title>
        <Badge variant="light" color={enrichmentStatus === "enriched" ? "teal" : "red"}>
          {enrichmentStatus}
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
        <Field label={infoPanel.industry} value={industry ?? empty} />
        <Field
          label={infoPanel.employeeCount}
          value={employeeCount ? employeeCount.toLocaleString() : empty}
        />
        <Field label={infoPanel.revenue} value={formatCompactCurrency(revenue) ?? empty} />
        <Field label={infoPanel.funding} value={formatCompactCurrency(totalFunding) ?? empty} />
        <Field
          label={infoPanel.lastFundingAt}
          value={lastFundingAt ? formatDate(lastFundingAt) : empty}
        />
        <Field label={infoPanel.growth6mo} value={pct(growth6mo)} />
        <Field label={infoPanel.growth12mo} value={pct(growth12mo)} />
        <Field label={infoPanel.growth24mo} value={pct(growth24mo)} />
      </SimpleGrid>

      {techStack.length > 0 && (
        <Stack gap={6} mt="lg">
          <Text size="xs" c="dimmed">
            {infoPanel.techStack}
          </Text>
          <Group gap={6}>
            {techStack.map((tech) => (
              <Badge key={tech} size="sm" variant="outline" color="gray" tt="none" fw="normal">
                {tech}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {departments && (
        <Stack gap={6} mt="lg">
          <Text size="xs" c="dimmed">
            {infoPanel.deptHeadcount}
          </Text>
          <Stack gap={6}>
            {departments.map(([department, count]) => (
              <Group key={department} gap="sm" wrap="nowrap">
                <Text size="xs" w={110} style={{ flexShrink: 0 }} truncate>
                  {department}
                </Text>
                <Box style={{ flex: 1, background: "var(--mantine-color-gray-1)", borderRadius: 4 }}>
                  <Box
                    h={6}
                    bg="blue.4"
                    bdrs="sm"
                    style={{ width: `${(count / maxDeptCount) * 100}%` }}
                  />
                </Box>
                <Text size="xs" c="dimmed" w={28} ta="right" style={{ flexShrink: 0 }}>
                  {count}
                </Text>
              </Group>
            ))}
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}
