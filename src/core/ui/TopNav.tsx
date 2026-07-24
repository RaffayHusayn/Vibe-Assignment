import { Box, Group, Paper, TextInput } from "@mantine/core";
import { coreStrings } from "../strings";

export function TopNav() {
  return (
    <Group h="100%" justify="space-between" wrap="nowrap" px="xl">
      {/* Left: global search placeholder */}
      <TextInput
        placeholder={coreStrings.topNav.searchPlaceholder}
        radius="md"
        flex={1}
        maw={420}
      />

      {/* Right: status indicators / notifications placeholders */}
      <Group gap="sm" wrap="nowrap">
        <Paper w={34} h={34} radius="md" withBorder />
        <Paper w={34} h={34} radius="md" withBorder />
        <Box w={34} h={34} bg="gray.3" style={{ borderRadius: "50%" }} />
      </Group>
    </Group>
  );
}
