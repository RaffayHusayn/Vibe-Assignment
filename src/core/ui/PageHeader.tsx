import { Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { Fragment, type ReactNode } from "react";

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  metaItems: readonly string[];
  primaryAction?: ReactNode;
  backAction?: ReactNode;
}

export function PageHeader({
  breadcrumb,
  title,
  metaItems,
  primaryAction,
  backAction,
}: PageHeaderProps) {
  return (
    <Box mb="xl">
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        {/* Left: back, breadcrumb, title, meta row */}
        <Stack gap={6}>
          {backAction}
          <Text size="xs" c="dimmed">
            {breadcrumb}
          </Text>
          <Title order={1}>{title}</Title>
          <Group gap="xs">
            {metaItems.map((item, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <Text size="sm" c="dimmed">
                    ·
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  {item}
                </Text>
              </Fragment>
            ))}
          </Group>
        </Stack>

        {/* Right: page-level actions */}
        <Group gap="sm" wrap="nowrap">
          {primaryAction}
        </Group>
      </Group>
      {/* Bleed out of the parent's p="xl" so this connects edge-to-edge with
          TopNav's divider and the sidebar border, instead of floating inset. */}
      <Divider style={{ marginInline: "calc(var(--mantine-spacing-xl) * -1)" }} />
    </Box>
  );
}
