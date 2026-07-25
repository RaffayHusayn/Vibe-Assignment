"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/core/db";
import { domainFromEmail } from "@/src/core/utils/extract";
import { isValidEmail } from "@/src/core/utils/validation";
import { enrichCompany } from "@/src/core/integrations/apollo";
import type { Core_Company } from "@/src/generated/prisma/client";

export type CaptureContactState = {
  ok: boolean;
  error?: string;
  contact?: { name: string; email: string; company: string };
};

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Run the Apollo enrich pass for a freshly created company and persist the result. */
async function enrichCompanyRecord(company: Core_Company): Promise<Core_Company> {
  try {
    const enrichment = await enrichCompany(company.domain);
    if (!enrichment) {
      return await prisma.core_Company.update({
        where: { id: company.id },
        data: { enrichmentStatus: "failed", enrichedAt: new Date() },
      });
    }
    return await prisma.core_Company.update({
      where: { id: company.id },
      data: { ...enrichment, enrichmentStatus: "enriched", enrichedAt: new Date() },
    });
  } catch {
    return await prisma.core_Company.update({
      where: { id: company.id },
      data: { enrichmentStatus: "failed", enrichedAt: new Date() },
    });
  }
}

/**
 * Find the company for a domain, creating a shell if it doesn't exist yet.
 * Idempotent under the unique `domain` constraint, so two booth captures for
 * the same new company land on the same record.
 */
async function findOrCreateCompany(domain: string, provisionalName: string): Promise<Core_Company> {
  const existing = await prisma.core_Company.findUnique({ where: { domain } });
  if (existing) return existing;

  try {
    // Seed a provisional display name from the mocked extraction; the Apollo
    // enrich pass right below overwrites it with the canonical name.
    const created = await prisma.core_Company.create({
      data: { domain, name: provisionalName || null },
    });
    return await enrichCompanyRecord(created);
  } catch {
    // Lost a race with a concurrent capture for the same domain — re-read.
    const raced = await prisma.core_Company.findUnique({ where: { domain } });
    if (raced) return raced;
    throw new Error(`Failed to resolve company for domain ${domain}`);
  }
}

/** Capture an attendee at an event's booth: upsert the contact and its company, then log a touchpoint. */
export async function captureContact(
  _prev: CaptureContactState,
  form: FormData,
): Promise<CaptureContactState> {
  const eventId = str(form, "eventId");
  const email = str(form, "email").toLowerCase();
  const name = str(form, "name");
  const companyName = str(form, "company");
  const role = str(form, "role");
  const note = str(form, "note");

  if (!eventId) {
    return { ok: false, error: "Missing event." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a valid work email." };
  }

  const domain = domainFromEmail(email);
  if (!domain) {
    return { ok: false, error: "Enter a valid work email." };
  }

  const company = await findOrCreateCompany(domain, companyName);

  // Reuse an existing contact by email (same person met at another event) or
  // create a new one. A booth re-scan should add a touchpoint, not a duplicate.
  // When updating, a blank field on this capture shouldn't erase a value a
  // previous capture already filled in.
  const existing = await prisma.core_Contact.findUnique({ where: { email } });
  const contact = existing
    ? await prisma.core_Contact.update({
        where: { id: existing.id },
        data: {
          name: name || existing.name,
          title: role || existing.title,
          companyId: company.id,
        },
      })
    : await prisma.core_Contact.create({
        data: { email, name: name || null, title: role || null, companyId: company.id },
      });

  await prisma.core_TouchPoint.create({
    data: { contactId: contact.id, eventId, note },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/sales");
  revalidatePath(`/sales/${company.id}`);

  return {
    ok: true,
    contact: {
      name: contact.name ?? name,
      email: contact.email,
      company: company.name ?? companyName,
    },
  };
}

/** Remove a single touchpoint (e.g. a mis-captured booth visit) from an event. */
export async function deleteTouchpoint(form: FormData): Promise<void> {
  const id = str(form, "touchpointId");
  const eventId = str(form, "eventId");
  if (!id) return;

  await prisma.core_TouchPoint.delete({ where: { id } });
  revalidatePath(`/events/${eventId}`);
}
