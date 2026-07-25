"use client";

import { Box, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";

// Grainy laminate texture for the badge surface — a self-contained SVG data URI
// so the "premium badge" look doesn't depend on an external asset.
const NOISE_OVERLAY =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface EmailParts {
  local: string;
  domainName: string;
  tld: string;
}

/** Splits an email into the pieces the extraction reads from: local @ domainName . tld */
function splitEmail(email: string): EmailParts {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at === -1) return { local: trimmed, domainName: "", tld: "" };

  const local = trimmed.slice(0, at);
  const domainFull = trimmed.slice(at + 1);
  const dot = domainFull.indexOf(".");
  if (dot === -1) return { local, domainName: domainFull, tld: "" };

  return { local, domainName: domainFull.slice(0, dot), tld: domainFull.slice(dot + 1) };
}

interface ExtractedCardProps {
  email: string;
  emailValid: boolean;
  name: string;
  company: string;
  onNameChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
}

export function ExtractedCard({
  email,
  emailValid,
  name,
  company,
  onNameChange,
  onCompanyChange,
}: ExtractedCardProps) {
  const [editing, setEditing] = useState<"name" | "company" | null>(null);
  const { local, domainName, tld } = splitEmail(email);

  return (
    <Box
      style={{
        position: "relative",
        aspectRatio: "1.6",
        borderRadius: "var(--mantine-radius-lg)",
        overflow: "hidden",
        background: "linear-gradient(135deg, #12a35a 0%, #034a24 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -18px 32px rgba(0,0,0,0.35), 0 20px 40px -18px rgba(0,0,0,0.5)",
        opacity: emailValid ? 1 : 0.5,
        transition: "opacity 200ms ease",
      }}
    >
      <Box
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: NOISE_OVERLAY,
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Lanyard punch hole — lets the page background show through */}
      <Box
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 56,
          height: 14,
          borderRadius: 999,
          background: "var(--mantine-color-body)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.45)",
        }}
      />

      <Stack
        justify="center"
        align="center"
        gap={4}
        style={{ position: "relative", height: "100%", padding: "2.25rem 1.5rem 1.25rem" }}
      >
        {/* 1. ADDED: Top spacer to push Name & Company down */}
        <Box style={{ flex: 1 }} />
        {editing === "name" ? (
          <TextInput
            variant="unstyled"
            value={name}
            onChange={(event) => onNameChange(event.currentTarget.value)}
            onBlur={() => setEditing(null)}
            autoFocus
            styles={{
              input: {
                color: "white",
                fontSize: "1.75rem",
                fontWeight: 600,
                textAlign: "center",
                height: "auto",
              },
            }}
          />
        ) : (
          <Title
            order={2}
            onClick={() => setEditing("name")}
            style={{ color: "white", cursor: "text", textAlign: "center" }}
          >
            {name || "Attendee name"}
          </Title>
        )}

        {editing === "company" ? (
          <TextInput
            variant="unstyled"
            value={company}
            onChange={(event) => onCompanyChange(event.currentTarget.value)}
            onBlur={() => setEditing(null)}
            autoFocus
            styles={{
              input: {
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.9rem",
                fontWeight: 600,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 3,
                height: "auto",
              },
            }}
          />
        ) : (
          <Text
            onClick={() => setEditing("company")}
            tt="uppercase"
            fw={600}
            style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 3, cursor: "text" }}
          >
            {company || "Company"}
          </Text>
        )}

        <Box style={{ flex: 1 }} />

        {/* Seed trace: shows exactly which substrings the name/company were read from */}
        <Text
          size="xs"
          ff="monospace"
          ta="center"
          style={{ color: "rgba(255,255,255,0.55)", width: "100%" }}
        >
          <span style={{ color: "#7CFFB2", fontWeight: 700 }}>{local || "…"}</span>
          {"@"}
          <span style={{ color: "#7CFFB2", fontWeight: 700 }}>{domainName || "…"}</span>
          {`.${tld || "com"}`}
        </Text>
      </Stack>
    </Box>
  );
}
