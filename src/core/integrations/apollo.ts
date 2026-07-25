import rampFixture from "./apollo-fixtures/ramp.com.json";
import vibeFixture from "./apollo-fixtures/vibe.co.json";

export type ApolloOrganization = {
  name: string;
  industry: string | null;
  industries?: string[];
  estimated_num_employees: number | null;
  annual_revenue: number | null;
  total_funding: number | null;
  latest_funding_round_date: string | null;
  latest_funding_stage?: string | null;
  technology_names: string[];
  departmental_head_count: Record<string, number>;
  organization_headcount_six_month_growth: number | null;
  organization_headcount_twelve_month_growth: number | null;
  organization_headcount_twenty_four_month_growth: number | null;
  short_description?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  website_url?: string | null;
};

type ApolloResponse = { organization: ApolloOrganization };

export type ApolloEnrichment = {
  name: string;
  industry: string | null;
  employeeCount: number | null;
  revenue: bigint | null;
  growth6mo: number | null;
  growth12mo: number | null;
  growth24mo: number | null;
  totalFunding: bigint | null;
  lastFundingAt: Date | null;
  techStack: string[];
  deptHeadcount: Record<string, number>;
};

// Real Apollo responses keyed by primary domain. Add more by dropping another
// Apollo enrich JSON into ./apollo-fixtures and registering it here.
const FIXTURES: Record<string, ApolloResponse> = {
  "ramp.com": rampFixture as ApolloResponse,
  "vibe.co": vibeFixture as ApolloResponse,
};

/** Map a raw Apollo `organization` into our normalized enrichment shape. */
export function mapOrganization(org: ApolloOrganization): ApolloEnrichment {
  return {
    name: org.name,
    industry: org.industry ?? org.industries?.[0] ?? null,
    employeeCount: org.estimated_num_employees ?? null,
    revenue: org.annual_revenue != null ? BigInt(Math.round(org.annual_revenue)) : null,
    growth6mo: org.organization_headcount_six_month_growth,
    growth12mo: org.organization_headcount_twelve_month_growth,
    growth24mo: org.organization_headcount_twenty_four_month_growth,
    totalFunding: org.total_funding != null ? BigInt(Math.round(org.total_funding)) : null,
    lastFundingAt: org.latest_funding_round_date ? new Date(org.latest_funding_round_date) : null,
    techStack: Array.from(new Set(org.technology_names ?? [])),
    deptHeadcount: org.departmental_head_count ?? {},
  };
}

const APOLLO_ENRICH_URL = "https://api.apollo.io/api/v1/organizations/enrich";


async function fetchOrganization(domain: string): Promise<ApolloOrganization | null> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return FIXTURES[domain]?.organization ?? null;
  }

  const url = new URL(APOLLO_ENRICH_URL);
  url.searchParams.set("domain", domain);

  const res = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Apollo enrich failed for ${domain}: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as ApolloResponse;
  return data.organization ?? null;
}


export async function enrichCompany(domain: string): Promise<ApolloEnrichment | null> {
  const org = await fetchOrganization(domain);
  return org ? mapOrganization(org) : null;
}
