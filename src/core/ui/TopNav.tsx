"use client";

import { Group, Loader, Select, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBuilding, IconSearch, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { searchDirectory } from "../actions/search";
import { coreStrings } from "../strings";

type Option = {
  value: string;
  label: string;
  detail: string;
};

export function TopNav() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [groups, setGroups] = useState<{ group: string; items: Option[] }[]>([]);
  const [routesByValue, setRoutesByValue] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) return;

    startTransition(async () => {
      const results = await searchDirectory(q);
      const routes: Record<string, string> = {};

      const contacts: Option[] = results.contacts.map((contact) => {
        const value = `contact:${contact.id}`;
        routes[value] = `/sales/${contact.companyId}`;
        return {
          value,
          label: contact.name ?? contact.email,
          detail: contact.companyName ? `${contact.email} · ${contact.companyName}` : contact.email,
        };
      });

      const companies: Option[] = results.companies.map((company) => {
        const value = `company:${company.id}`;
        routes[value] = `/sales/${company.id}`;
        return { value, label: company.name ?? company.domain, detail: company.domain };
      });

      const nextGroups = [];
      if (contacts.length) nextGroups.push({ group: coreStrings.topNav.searchGroupContacts, items: contacts });
      if (companies.length) nextGroups.push({ group: coreStrings.topNav.searchGroupCompanies, items: companies });

      setGroups(nextGroups);
      setRoutesByValue(routes);
    });
  }, [debouncedQuery]);

  return (
    <Group h="100%" justify="space-between" wrap="nowrap" px="xl">
      <Select
        className="search-select"
        placeholder={coreStrings.topNav.searchPlaceholder}
        leftSection={<IconSearch size={16} stroke={1.5} />}
        rightSection={isPending ? <Loader size={14} /> : null}
        radius="md"
        flex={1}
        maw={820}
        searchable
        clearable
        searchValue={query}
        onSearchChange={(value) => {
          setQuery(value);
          if (!value.trim()) {
            setGroups([]);
            setRoutesByValue({});
          }
        }}
        data={groups}
        filter={({ options }) => options}
        nothingFoundMessage={query.trim() ? coreStrings.topNav.searchNoResults : null}
        comboboxProps={{ withinPortal: true }}
        onChange={(value) => {
          if (!value) return;
          const href = routesByValue[value];
          if (href) router.push(href);
          setQuery("");
        }}
        renderOption={({ option }) => {
          const item = option as Option;
          const isContact = item.value.startsWith("contact:");
          return (
            <Group gap="xs" wrap="nowrap">
              {isContact ? <IconUser size={14} stroke={1.5} /> : <IconBuilding size={14} stroke={1.5} />}
              <div>
                <Text size="sm">{item.label}</Text>
                <Text size="xs" c="dimmed">
                  {item.detail}
                </Text>
              </div>
            </Group>
          );
        }}
        styles={{
          input: {
            backgroundColor: "var(--mantine-color-gray-2)",
            borderColor: "var(--mantine-color-gray-4)",
          },
        }}
      />
    </Group>
  );
}
