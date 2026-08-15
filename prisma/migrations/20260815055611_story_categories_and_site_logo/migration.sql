-- CreateEnum
CREATE TYPE "StoryCategory" AS ENUM ('PHOTO', 'VIDEO', 'MERCH');

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "category" "StoryCategory" NOT NULL DEFAULT 'PHOTO';
