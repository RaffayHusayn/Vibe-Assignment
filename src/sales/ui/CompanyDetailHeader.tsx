import { Anchor, Avatar, Badge, Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowUpRight, IconBuilding, IconUsers } from "@tabler/icons-react";
import type { SalesStage } from "@/src/generated/prisma/client";
import { salesStrings } from "../strings";
import { BackToPipelineButton } from "./BackToPipelineButton";
import { StageToggle } from "./StageToggle";

interface CompanyDetailHeaderProps {
  companyId: string;
  name: string;
  domain: string;
  stage: SalesStage;
  employeeCount: number | null;
  revenueLabel: string | null;
  contactsCount: number;
  enrichmentStatus: "pending" | "enriched" | "failed";
}

export function CompanyDetailHeader({
  companyId,
  name,
  domain,
  stage,
  employeeCount,
  revenueLabel,
  contactsCount,
  enrichmentStatus,
}: CompanyDetailHeaderProps) {
  const { detail } = salesStrings;

  return (
    <Box mb="xl">
      <BackToPipelineButton label={detail.backLabel} />

      <Divider my="md" style={{ marginInline: "calc(var(--mantine-spacing-xl) * -1)" }} />

      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        <Group gap="md" align="flex-start" wrap="nowrap">
          <Avatar src={`https://logo.clearbit.com/${domain}`} alt={name} size={56} radius="md">
            <IconBuilding size={28} />
          </Avatar>

          <Stack gap={6}>
            <Group gap="xs">
              <Title order={1}>{name}</Title>
              {enrichmentStatus !== "enriched" && (
                <Badge color={enrichmentStatus === "failed" ? "red" : "gray"} variant="outline">
                  {enrichmentStatus === "failed" ? "Enrichment failed" : "Enriching"}
                </Badge>
              )}
            </Group>
            <Anchor
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              display="inline-flex"
              style={{ alignItems: "center", gap: 2, width: "fit-content" }}
            >
              {domain}
              <IconArrowUpRight size={14} stroke={1.75} />
            </Anchor>
            <Group gap="md">
              {employeeCount && (
                <Group gap={6} wrap="nowrap">
                  <IconUsers size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed">
                    {employeeCount.toLocaleString()} {detail.employeesLabel}
                  </Text>
                </Group>
              )}
              {revenueLabel && (
                <Text size="sm" c="dimmed">
                  {revenueLabel} revenue
                </Text>
              )}
              <Text size="sm" c="dimmed">
                {contactsCount} {detail.contactsLabel}
              </Text>
            </Group>
          </Stack>
        </Group>

        <StageToggle companyId={companyId} stage={stage} size="md" />
      </Group>

      <Divider style={{ marginInline: "calc(var(--mantine-spacing-xl) * -1)" }} />
    </Box>
  );
}
