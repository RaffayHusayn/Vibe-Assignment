"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { prisma } from "@/src/core/db";
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-your-key")) {
    return {
      ok: false,
      error: "OPENAI_API_KEY isn't configured — add a real key to .env to enable drafting.",
    };
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

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a sales rep writing a short, warm, non-pushy outreach email. " +
            'Respond with strict JSON: {"subject": string, "body": string}. ' +
            "The body should be plain text, no markdown, no placeholders like [Your Name].",
        },
        { role: "user", content: context.join("\n\n") },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { ok: false, error: "The model returned an empty response." };

    const parsed = JSON.parse(raw) as { subject?: string; body?: string };
    if (!parsed.subject || !parsed.body) {
      return { ok: false, error: "The model response was missing a subject or body." };
    }

    return { ok: true, draft: { subject: parsed.subject, body: parsed.body } };
  } catch {
    return { ok: false, error: "Failed to generate a draft. Try again." };
  }
}
