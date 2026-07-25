import { IconBriefcase, IconCalendarEvent } from "@tabler/icons-react";
import type { ComponentType } from "react";
import { coreStrings } from "./strings";

export type WorkspaceId = "events" | "sales";

export type WorkspaceIcon = ComponentType<{
  size?: string | number;
  stroke?: string | number;
}>;

export interface NavItem {
  label: string;
  href: string;
}

export interface WorkspaceConfig {
  id: WorkspaceId;
  label: string;
  href: string;
  icon: WorkspaceIcon;
  color: string;
  nav: NavItem[];
}

export const workspaces: WorkspaceConfig[] = [
  {
    id: "events",
    label: coreStrings.workspace.events,
    href: "/events",
    icon: IconCalendarEvent,
    color: "teal",
    nav: [{ label: coreStrings.nav.events, href: "/events" }],
  },
  {
    id: "sales",
    label: coreStrings.workspace.sales,
    href: "/sales",
    icon: IconBriefcase,
    color: "indigo",
    nav: [{ label: coreStrings.nav.companies, href: "/sales" }],
  },
];

export function getActiveWorkspace(pathname: string): WorkspaceConfig {
  const match = workspaces.find(
    (workspace) =>
      pathname === workspace.href || pathname.startsWith(`${workspace.href}/`),
  );
  return match ?? workspaces[0];
}
