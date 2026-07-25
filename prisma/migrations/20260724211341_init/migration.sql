-- CreateEnum
CREATE TYPE "EnrichmentStatus" AS ENUM ('enriched', 'failed');

-- CreateEnum
CREATE TYPE "SalesStage" AS ENUM ('new', 'contacted', 'qualified', 'closed');

-- CreateTable
CREATE TABLE "core_company" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT,
    "industry" TEXT,
    "employeeCount" INTEGER,
    "revenue" BIGINT,
    "growth6mo" DOUBLE PRECISION,
    "growth12mo" DOUBLE PRECISION,
    "growth24mo" DOUBLE PRECISION,
    "totalFunding" BIGINT,
    "lastFundingAt" TIMESTAMP(3),
    "techStack" TEXT[],
    "deptHeadcount" JSONB,
    "enrichmentStatus" "EnrichmentStatus" NOT NULL,
    "enrichedAt" TIMESTAMP(3),

    CONSTRAINT "core_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "companyId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "core_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_touchpoint" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "core_touchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_pipeline" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "stage" "SalesStage" NOT NULL DEFAULT 'new',

    CONSTRAINT "sales_pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_activity_timeline" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "sales_activity_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_company_domain_key" ON "core_company"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "core_contact_email_key" ON "core_contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sales_pipeline_companyId_key" ON "sales_pipeline"("companyId");

-- AddForeignKey
ALTER TABLE "core_contact" ADD CONSTRAINT "core_contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_touchpoint" ADD CONSTRAINT "core_touchpoint_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "core_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_touchpoint" ADD CONSTRAINT "core_touchpoint_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events_event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_pipeline" ADD CONSTRAINT "sales_pipeline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_activity_timeline" ADD CONSTRAINT "sales_activity_timeline_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "sales_pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
