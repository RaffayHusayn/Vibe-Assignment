"use server";

import { prisma } from "@/src/core/db";

export type ContactSearchResult = {
  id: string;
  name: string | null;
  email: string;
  companyId: string;
  companyName: string | null;
};

export type CompanySearchResult = {
  id: string;
  name: string | null;
  domain: string;
};

export type SearchResults = {
  contacts: ContactSearchResult[];
  companies: CompanySearchResult[];
};

const RESULT_LIMIT = 5;

/** Search contacts and companies by name/email/domain for the global search bar. */
export async function searchDirectory(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return { contacts: [], companies: [] };

  const [contacts, companies] = await Promise.all([
    prisma.core_Contact.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { company: true },
      take: RESULT_LIMIT,
      orderBy: { createdAt: "desc" },
    }),
    prisma.core_Company.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { domain: { contains: q, mode: "insensitive" } },
        ],
      },
      take: RESULT_LIMIT,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    contacts: contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      companyId: contact.companyId,
      companyName: contact.company.name,
    })),
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
      domain: company.domain,
    })),
  };
}
