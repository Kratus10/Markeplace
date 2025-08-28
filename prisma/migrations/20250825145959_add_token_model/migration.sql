-- CreateTable
CREATE TABLE "public"."Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "public"."Token"("token");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "public"."Token"("userId");

-- CreateIndex
CREATE INDEX "Token_token_idx" ON "public"."Token"("token");

-- CreateIndex
CREATE INDEX "Token_purpose_idx" ON "public"."Token"("purpose");

-- CreateIndex
CREATE INDEX "Token_expiresAt_idx" ON "public"."Token"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
