import OpenAI from "openai";

export type EmailDraft = { subject: string; body: string };

/** Thrown for expected, user-facing failures (missing config, malformed response) —
 * as opposed to unexpected errors (network, parsing), which callers should mask
 * behind a generic message. */
export class EmailDraftError extends Error {}

const SYSTEM_PROMPT =
  "You are a sales rep writing a short, warm, non-pushy outreach email. " +
  'Respond with strict JSON: {"subject": string, "body": string}. ' +
  "The body should be plain text, no markdown, no placeholders like [Your Name].";

/** Ask the model for a subject/body pair grounded in the given context. */
export async function generateEmailDraft(context: string): Promise<EmailDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-your-key")) {
    throw new EmailDraftError(
      "OPENAI_API_KEY isn't configured — add a real key to .env to enable drafting.",
    );
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: context },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new EmailDraftError("The model returned an empty response.");

  const parsed = JSON.parse(raw) as { subject?: string; body?: string };
  if (!parsed.subject || !parsed.body) {
    throw new EmailDraftError("The model response was missing a subject or body.");
  }

  return { subject: parsed.subject, body: parsed.body };
}
