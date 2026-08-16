-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('WEB_DEV', 'DIGITAL_MARKETING', 'PHOTO', 'VIDEO', 'GRAPHIC_DESIGN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "PortfolioProject" ADD COLUMN     "category" "ProjectCategory" NOT NULL DEFAULT 'WEB_DEV',
ADD COLUMN     "devTime" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'COMPLETED';
