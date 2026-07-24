import { Card, Grid, GridCol, Paper, Stack } from "@mantine/core";

export function ContentSplit() {
  return (
    <Grid>
      {/* Left column: primary list container */}
      <GridCol span={{ base: 12, md: 8 }}>
        <Paper withBorder radius="md" mih={420} />
      </GridCol>

      {/* Right column: secondary list of cards */}
      <GridCol span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Card withBorder radius="md" h={130} />
          <Card withBorder radius="md" h={130} />
          <Card withBorder radius="md" h={130} />
        </Stack>
      </GridCol>
    </Grid>
  );
}
