-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Topic" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;
