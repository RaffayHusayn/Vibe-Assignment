import { Avatar, Box, Divider, Group, NavLink, Paper, Stack, Text } from "@mantine/core";
import { coreStrings } from "../strings";

export function Sidebar() {
  return (
    <Stack h="100%" gap="lg" justify="flex-start">
      {/* Logo / brand */}
      <Group gap="sm" px={4}>
        <Box
          w={28}
          h={28}
          bg="dark.4"
          bdrs="sm"
          style={{ flexShrink: 0 }}
        />
        <Text fw={700} size="sm">
          {coreStrings.brand.name}
        </Text>
      </Group>

      {/* Workspace switcher */}
      <Paper withBorder radius="md" p="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Box
              w={22}
              h={22}
              bg="gray.3"
              bdrs="sm"
              style={{ flexShrink: 0 }}
            />
            <Box>
              <Text size="sm" fw={500} lh={1.2}>
                {coreStrings.workspace.name}
              </Text>
              <Text size="xs" c="dimmed" lh={1.2}>
                {coreStrings.workspace.plan}
              </Text>
            </Box>
          </Group>
          <Box w={12} h={12} bg="gray.4" bdrs={2} style={{ flexShrink: 0 }} />
        </Group>
      </Paper>

      {/* Navigation */}
      <Stack gap={2}>
        {coreStrings.navigation.map((item, index) => (
          <NavLink
            key={item.label}
            label={item.label}
            active={index === 0}
            variant="filled"
            bdrs="sm"
          />
        ))}
      </Stack>

      {/* Bottom: user profile */}
      <Box mt="auto">
        <Divider />
        <Group gap="sm" p="xs" wrap="nowrap">
          <Avatar radius="xl" size="sm" />
          <Box miw={0}>
            <Text size="sm" fw={500} truncate>
              {coreStrings.userProfile.name}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {coreStrings.userProfile.email}
            </Text>
          </Box>
        </Group>
      </Box>
    </Stack>
  );
}
