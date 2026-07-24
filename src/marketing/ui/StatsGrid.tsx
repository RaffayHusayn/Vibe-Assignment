import { Paper, SimpleGrid } from "@mantine/core";

export function StatsGrid() {
  return (
    <SimpleGrid cols={3} mb="xl">
      <Paper withBorder radius="md" h={110} />
      <Paper withBorder radius="md" h={110} />
      <Paper withBorder radius="md" h={110} />
    </SimpleGrid>
  );
}
