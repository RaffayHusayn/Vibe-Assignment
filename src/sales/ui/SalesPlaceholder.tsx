import { Paper, Text } from "@mantine/core";
import { salesStrings } from "../strings";

// Placeholder establishing the sales/ui domain folder — structure only, no view built yet.
export function SalesPlaceholder() {
  return (
    <Paper withBorder radius="md" p="lg">
      <Text size="sm" c="dimmed">
        {salesStrings.placeholder.message}
      </Text>
    </Paper>
  );
}
