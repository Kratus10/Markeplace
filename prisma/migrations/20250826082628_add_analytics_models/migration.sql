-- CreateTable
CREATE TABLE "public"."AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "url" TEXT,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsMetric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimension" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsExport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "fileType" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "downloadUrl" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_createdAt_idx" ON "public"."AnalyticsEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "public"."AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "public"."AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "public"."AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsMetric_name_date_idx" ON "public"."AnalyticsMetric"("name", "date");

-- CreateIndex
CREATE INDEX "AnalyticsMetric_dimension_idx" ON "public"."AnalyticsMetric"("dimension");

-- CreateIndex
CREATE INDEX "AnalyticsExport_userId_idx" ON "public"."AnalyticsExport"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsExport_status_idx" ON "public"."AnalyticsExport"("status");

-- CreateIndex
CREATE INDEX "AnalyticsExport_requestedAt_idx" ON "public"."AnalyticsExport"("requestedAt");

-- CreateIndex
CREATE INDEX "AnalyticsAlert_userId_idx" ON "public"."AnalyticsAlert"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsAlert_type_idx" ON "public"."AnalyticsAlert"("type");

-- CreateIndex
CREATE INDEX "AnalyticsAlert_status_idx" ON "public"."AnalyticsAlert"("status");

-- CreateIndex
CREATE INDEX "AnalyticsAlert_triggeredAt_idx" ON "public"."AnalyticsAlert"("triggeredAt");

-- AddForeignKey
ALTER TABLE "public"."AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsExport" ADD CONSTRAINT "AnalyticsExport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsAlert" ADD CONSTRAINT "AnalyticsAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
