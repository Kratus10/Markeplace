/*
  Warnings:

  - Added the required column `updatedAt` to the `ModerationLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `ModerationLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ModerationAction" AS ENUM ('REPORT', 'APPROVE', 'HIDE', 'DELETE', 'BAN_USER', 'WARN_USER');

-- AlterEnum
ALTER TYPE "public"."PostStatus" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "public"."ModerationLog" DROP CONSTRAINT "ModerationLog_moderatorId_fkey";

-- AlterTable
ALTER TABLE "public"."ModerationLog" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "moderatorId" DROP NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "public"."ModerationAction" NOT NULL;

-- CreateIndex
CREATE INDEX "ModerationLog_status_idx" ON "public"."ModerationLog"("status");

-- AddForeignKey
ALTER TABLE "public"."ModerationLog" ADD CONSTRAINT "ModerationLog_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
