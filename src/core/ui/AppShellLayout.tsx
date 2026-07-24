import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Box,
} from "@mantine/core";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      layout="alt"
      header={{ height: 64 }}
      navbar={{ width: 250, breakpoint: "sm" }}
    >
      <AppShellHeader>
        <TopNav />
      </AppShellHeader>

      <AppShellNavbar withBorder>
        <Sidebar />
      </AppShellNavbar>

      <AppShellMain>
        <Box p="xl">{children}</Box>
      </AppShellMain>
    </AppShell>
  );
}
