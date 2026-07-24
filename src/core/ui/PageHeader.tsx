import { Box, Button, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { Fragment } from "react";

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  metaItems: readonly string[];
  primaryAction: string;
  secondaryAction: string;
}

export function PageHeader({
  breadcrumb,
  title,
  metaItems,
  primaryAction,
  secondaryAction,
}: PageHeaderProps) {
  return (
    <Box mb="xl">
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        {/* Left: breadcrumb, title, meta row */}
        <Stack gap={6}>
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
          <Button variant="default">{secondaryAction}</Button>
          <Button>{primaryAction}</Button>
        </Group>
      </Group>
      <Divider />
    </Box>
  );
}
