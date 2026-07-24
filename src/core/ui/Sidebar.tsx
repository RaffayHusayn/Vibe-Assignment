"use client";

import {
  Avatar,
  Box,
  Divider,
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
  UnstyledButton,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconSelector } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActiveWorkspace, workspaces } from "../navigation";
import { coreStrings } from "../strings";

export function Sidebar() {
  const pathname = usePathname();
  const activeWorkspace = getActiveWorkspace(pathname);
  const { hovered, ref: switcherRef } = useHover<HTMLButtonElement>();

  return (
    <Stack h="100%" gap="lg" justify="flex-start">
      {/* Logo / brand */}
      <Group gap="sm" px={4}>
        <Box w={28} h={28} bg="dark.4" bdrs="sm" style={{ flexShrink: 0 }} />
        <Text fw={700} size="sm">
          {coreStrings.brand.name}
        </Text>
      </Group>

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
                <ThemeIcon variant="light" color="blue" size={28} radius="sm">
                  <activeWorkspace.icon size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={500} lh={1.2}>
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
              leftSection={<workspace.icon size={16} />}
              fw={workspace.id === activeWorkspace.id ? 600 : 400}
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
