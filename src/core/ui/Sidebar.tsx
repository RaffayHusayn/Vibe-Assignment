"use client";

import {
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconLayoutKanban, IconSelector } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActiveWorkspace, workspaces } from "../navigation";
import { coreStrings } from "../strings";

export function Sidebar() {
  const pathname = usePathname();
  const activeWorkspace = getActiveWorkspace(pathname);
  const { hovered, ref: switcherRef } = useHover<HTMLButtonElement>();

  return (
    <Stack h="100%" gap={0}>
      {/* Logo / brand — fixed height + border-bottom, aligned with TopNav's row */}
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Group
          h={64}
          px="xl"
          gap="sm"
          wrap="nowrap"
          style={{
            flexShrink: 0,
            borderBottom: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Box
            w={28}
            h={28}
            bdrs="sm"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-indigo-6) 100%)",
            }}
          >
            <IconLayoutKanban size={16} color="white" stroke={2} />
          </Box>
          <Title order={6}>{coreStrings.brand.name}</Title>
        </Group>
      </Link>

      <Stack gap="lg" justify="flex-start" p="md" style={{ flex: 1, minHeight: 0 }}>
        {/* Workspace switcher */}
        <Menu position="bottom-start" width="target" withinPortal>
          <MenuTarget>
            <UnstyledButton
              ref={switcherRef}
              w="100%"
              bg={hovered ? "gray.2" : "gray.1"}
              bd="1px solid var(--mantine-color-gray-3)"
              bdrs="md"
              p="xs"
              style={{ transition: "background-color 100ms ease" }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                  <ThemeIcon variant="light" color={activeWorkspace.color} size={28} radius="sm">
                    <activeWorkspace.icon size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" fw="medium" lh={1.2}>
                      {activeWorkspace.label}
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.2}>
                      {coreStrings.workspace.switcherLabel}
                    </Text>
                  </Box>
                </Group>
                <IconSelector size={16} stroke={1.5} color="var(--mantine-color-dimmed)" />
              </Group>
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            <MenuLabel>{coreStrings.workspace.switchPrompt}</MenuLabel>
            {workspaces.map((workspace) => (
              <MenuItem
                key={workspace.id}
                component={Link}
                href={workspace.href}
                leftSection={
                  <ThemeIcon variant="light" color={workspace.color} size={22} radius="sm">
                    <workspace.icon size={13} />
                  </ThemeIcon>
                }
                fw={workspace.id === activeWorkspace.id ? "bold" : "regular"}
              >
                {workspace.label}
              </MenuItem>
            ))}
          </MenuDropdown>
        </Menu>

        {/* Navigation */}
        <Stack gap={2}>
          {activeWorkspace.nav.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
              variant="filled"
              bdrs="sm"
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
