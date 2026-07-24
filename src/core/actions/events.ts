"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/src/core/db";
import { parseDate } from "@/src/core/utils/validation";

export type ActionState = {
  ok: boolean;
  error?: string;
};

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Create an event, then jump to its detail page. */
export async function createEvent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const name = str(form, "name");
  const city = str(form, "city");
  const startDate = str(form, "startDate");
  const endDate = str(form, "endDate");

  if (!name || !city || !startDate || !endDate) {
    return { ok: false, error: "All fields are required." };
  }

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) {
    return { ok: false, error: "Invalid dates." };
  }
  if (end < start) {
    return { ok: false, error: "End date can't be before start date." };
  }

  const event = await prisma.events_Event.create({
    data: { name, city, startDate: start, endDate: end },
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

/** Delete an event, unless it still has touchpoints captured against it. */
export async function deleteEvent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const eventId = str(form, "eventId");
  if (!eventId) {
    return { ok: false, error: "Missing event." };
  }

  const count = await prisma.core_TouchPoint.count({ where: { eventId } });
  if (count > 0) {
    return {
      ok: false,
      error: `Remove all ${count} touchpoint${count === 1 ? "" : "s"} before deleting this event.`,
    };
  }

  await prisma.events_Event.delete({ where: { id: eventId } });
  revalidatePath("/events");
  redirect("/events");
}
