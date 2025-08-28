/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `earningsCents` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `kycVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tradingExperience` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AnalyticsAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalyticsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalyticsExport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalyticsMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EarningsLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EngagementEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModerationLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayoutRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AnalyticsAlert" DROP CONSTRAINT "AnalyticsAlert_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnalyticsExport" DROP CONSTRAINT "AnalyticsExport_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EarningsLedger" DROP CONSTRAINT "EarningsLedger_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EngagementEvent" DROP CONSTRAINT "EngagementEvent_commentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EngagementEvent" DROP CONSTRAINT "EngagementEvent_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EngagementEvent" DROP CONSTRAINT "EngagementEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."License" DROP CONSTRAINT "License_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."License" DROP CONSTRAINT "License_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ModerationLog" DROP CONSTRAINT "ModerationLog_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PayoutRequest" DROP CONSTRAINT "PayoutRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVersion" DROP CONSTRAINT "ProductVersion_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topic" DROP CONSTRAINT "Topic_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topic" DROP CONSTRAINT "Topic_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topic" DROP CONSTRAINT "Topic_userId_fkey";

-- DropIndex
DROP INDEX "public"."Subscription_endDate_idx";

-- DropIndex
DROP INDEX "public"."TradingSignal_createdAt_idx";

-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "createdAt",
DROP COLUMN "icon",
DROP COLUMN "updatedAt",
ALTER COLUMN "color" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Subscription" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "startDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "avatar",
DROP COLUMN "bio",
DROP COLUMN "birthday",
DROP COLUMN "earningsCents",
DROP COLUMN "gender",
DROP COLUMN "kycVerified",
DROP COLUMN "lastSeen",
DROP COLUMN "location",
DROP COLUMN "occupation",
DROP COLUMN "password",
DROP COLUMN "status",
DROP COLUMN "tradingExperience",
DROP COLUMN "username",
ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."AnalyticsAlert";

-- DropTable
DROP TABLE "public"."AnalyticsEvent";

-- DropTable
DROP TABLE "public"."AnalyticsExport";

-- DropTable
DROP TABLE "public"."AnalyticsMetric";

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."EarningsLedger";

-- DropTable
DROP TABLE "public"."EngagementEvent";

-- DropTable
DROP TABLE "public"."License";

-- DropTable
DROP TABLE "public"."Message";

-- DropTable
DROP TABLE "public"."ModerationLog";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."Payment";

-- DropTable
DROP TABLE "public"."PayoutRequest";

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."ProductVersion";

-- DropTable
DROP TABLE "public"."Review";

-- DropTable
DROP TABLE "public"."SiteSettings";

-- DropTable
DROP TABLE "public"."Token";

-- DropTable
DROP TABLE "public"."Topic";

-- DropEnum
DROP TYPE "public"."EngagementType";

-- DropEnum
DROP TYPE "public"."FileStatus";

-- DropEnum
DROP TYPE "public"."ModerationAction";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- DropEnum
DROP TYPE "public"."PayoutStatus";

-- DropEnum
DROP TYPE "public"."PostStatus";

-- DropEnum
DROP TYPE "public"."ProductStatus";

-- DropEnum
DROP TYPE "public"."ReviewStatus";

-- CreateTable
CREATE TABLE "public"."ProfileVisibility" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showRole" BOOLEAN NOT NULL DEFAULT true,
    "showOccupation" BOOLEAN NOT NULL DEFAULT true,
    "showAge" BOOLEAN NOT NULL DEFAULT true,
    "showLocation" BOOLEAN NOT NULL DEFAULT true,
    "showPicture" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProfileVisibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileVisibility_userId_key" ON "public"."ProfileVisibility"("userId");

-- AddForeignKey
ALTER TABLE "public"."ProfileVisibility" ADD CONSTRAINT "ProfileVisibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
