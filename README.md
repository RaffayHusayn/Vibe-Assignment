## Project Description

It is a GTM intent pipeline tool that bridges the gap between onfield marketing and sales. Give it nothing more than an email captured at an event, and it handles the rest: extracting the name and company, enriching it with real data, and teeing up a context aware LLM based outreach for the sales rep. 

## How It Works

1. **(Events Vertical) On-field Contact Capture**: Onsite marketing/events team logs an individual they meet. Just the email is enough, but they can also add title and raw conversation notes (this will be used as context for the sales vertical).

2. **(Automatic) Extraction & Enrichment**: The tool automatically extracts the individual's name and company, then creates an enriched company profile using the Apollo API.

3. **(Automatic) Sales Handoff**: The enriched data is queued in the sales kanban pipeline.

4. **(Sales Vertical)**: Sales team can selectively use any or all of the company profile, event-specific context, raw conversation notes, and custom instructions to generate highly targeted, LLM-based outreach.

## Getting Started

Install dependencies, then run the development server:

```bash
yarn install
yarn dev
```

## Project Structure

Project is split into three parallel domains 
— **`core`**
- **`sales`** 
- **`events`** 

`sales` and `events` are thin and only contain config, UI and strings for its own domain; `core` is where data access and mutations are centralized.

```
app/                      # routing only: pages, layouts, error boundaries
prisma/                   # schema and migrations
src/
├── core/                 # shared infrastructure
│   ├── actions/          # mutations, grouped by record not domain
│   ├── integrations/     # external API clients (Apollo, OpenAI)
│   ├── ui/               # cross-domain UI (shell, sidebar, nav)
│   └── utils/            # pure helpers (validation, string extraction)
├── sales/                # sales domain: strings, config, UI
│   └── ui/               # domain-specific UI (pipeline kanban board)
└── events/               # events domain: strings, config, UI
    └── ui/               # domain-specific UI (booth/event capture)
```

## What I Would Build Next
1. **Email verification** via Hunter.io before a contact enters the pipeline
2. **Enrichment waterfall** across multiple providers, not just Apollo
3. **Direct send** instead of stopping at draft generation
4. **Scheduled re-enrichment** to keep company data fresh over time
5. **News-based enrichment** for timely, relevant context

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
