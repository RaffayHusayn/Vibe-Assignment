export const salesStrings = {
  companies: {
    breadcrumb: "Sales / Companies",
    title: "Companies",
    primaryAction: "New company",
  },
  board: {
    columnEmpty: "No companies here",
    contactsLabel: (count: number) => `${count} contact${count === 1 ? "" : "s"}`,
    pendingBadge: "Enriching",
    failedBadge: "Enrichment failed",
  },
} as const;
