"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/core/db";
import { EmailDraftError, generateEmailDraft as draftEmail } from "@/src/core/integrations/openai";
import type { SalesStage } from "@/src/generated/prisma/client";

/** Move a company to a different pipeline stage (drag-and-drop on the board). Creates the pipeline row if the company doesn't have one yet. */
export async function updateCompanyStage(companyId: string, stage: SalesStage): Promise<void> {
  await prisma.sales_Pipeline.upsert({
    where: { companyId },
    create: { companyId, stage },
    update: { stage },
  });

  revalidatePath("/sales");
  revalidatePath(`/sales/${companyId}`);
}

export type ActionState = {
  ok: boolean;
  error?: string;
};

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Log a freeform activity note against a company's pipeline. Creates the pipeline row if needed. */
export async function addActivity(_prev: ActionState, form: FormData): Promise<ActionState> {
  const companyId = str(form, "companyId");
  const body = str(form, "body");

  if (!companyId) return { ok: false, error: "Missing company." };
  if (!body) return { ok: false, error: "Write something first." };

  const pipeline = await prisma.sales_Pipeline.upsert({
    where: { companyId },
    create: { companyId },
    update: {},
  });

  await prisma.sales_ActivityTimeline.create({
    data: { pipelineId: pipeline.id, body },
  });

  revalidatePath(`/sales/${companyId}`);
  return { ok: true };
}

export type GenerateEmailState = {
  ok: boolean;
  error?: string;
  draft?: { subject: string; body: string };
};

/** Draft an outreach email for a contact, optionally grounded in their touchpoint
 * notes, plus any freeform instructions. */
export async function generateEmailDraft(
  _prev: GenerateEmailState,
  form: FormData,
): Promise<GenerateEmailState> {
  const companyId = str(form, "companyId");
  const contactId = str(form, "contactId");
  const includeTouchpoints = form.get("includeTouchpoints") === "on";
  const instructions = str(form, "instructions");

  if (!contactId) {
    return { ok: false, error: "Pick who this email is for." };
  }

  const [company, contact] = await Promise.all([
    prisma.core_Company.findUnique({ where: { id: companyId } }),
    prisma.core_Contact.findUnique({
      where: { id: contactId },
      include: { touchpoints: { include: { event: true }, orderBy: { createdAt: "desc" } } },
    }),
  ]);
  if (!company || !contact) {
    return { ok: false, error: "Company or contact not found." };
  }

  const context: string[] = [
    `Company: ${company.name ?? company.domain} (${company.domain})`,
    ...(company.industry ? [`Industry: ${company.industry}`] : []),
    `Recipient: ${contact.name ?? contact.email}${contact.title ? `, ${contact.title}` : ""} <${contact.email}>`,
  ];

  if (includeTouchpoints && contact.touchpoints.length > 0) {
    const notes = contact.touchpoints
      .map((tp) => `- At ${tp.event.name}: ${tp.note}`)
      .join("\n");
    context.push(`Touchpoint notes from past interactions:\n${notes}`);
  }
  if (instructions) {
    context.push(`Additional instructions: ${instructions}`);
  }

  try {
    const draft = await draftEmail(context.join("\n\n"));
    return { ok: true, draft };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof EmailDraftError ? error.message : "Failed to generate a draft. Try again.",
    };
  }
}
