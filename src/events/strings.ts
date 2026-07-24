export const eventsStrings = {
  events: {
    breadcrumb: "Events",
    title: "Events",
    metaLabels: {
      total: "events",
      upcoming: "upcoming",
      past: "past",
    },
    primaryAction: "New event",
    secondaryAction: "Filter",
  },
  emptyState: {
    title: "No events yet",
    description: "Create your first event to start capturing contacts at the booth.",
    cta: "Create an event",
  },
  groups: {
    upcoming: "Upcoming",
    past: "Past",
  },
  card: {
    eyebrow: "Event",
    contactsLabel: "contacts captured",
    companiesLabel: "companies discovered",
  },
  createEvent: {
    modalTitle: "Create event",
    nameLabel: "Name",
    namePlaceholder: "Event name",
    cityLabel: "City",
    cityPlaceholder: "City",
    startDateLabel: "Start date",
    endDateLabel: "End date",
    submit: "Create event",
  },
  eventDetail: {
    backLabel: "Events",
    deleteAction: "Delete",
  },
  contacts: {
    breadcrumb: "Events / Contacts",
    title: "Contacts",
    metaItems: ["0 contacts", "0 verified", "0 companies"],
    primaryAction: "New contact",
    secondaryAction: "Filter",
  },
  companies: {
    breadcrumb: "Events / Companies",
    title: "Companies",
    metaItems: ["0 companies", "0 enriched", "0 pending"],
    primaryAction: "New company",
    secondaryAction: "Filter",
  },
} as const;
