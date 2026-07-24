"use server";

import { revalidatePath } from "next/cache";
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
}
