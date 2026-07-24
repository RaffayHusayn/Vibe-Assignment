import { AppShell, AppShellMain, AppShellNavbar, Box } from "@mantine/core";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell navbar={{ width: 250, breakpoint: "sm" }}>
      <AppShellNavbar withBorder p="md">
        <Sidebar />
      </AppShellNavbar>

      <AppShellMain>
        <TopNav />
        <Box p="xl">{children}</Box>
      </AppShellMain>
    </AppShell>
  );
}
