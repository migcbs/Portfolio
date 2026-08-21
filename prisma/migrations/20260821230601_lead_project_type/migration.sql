-- CreateEnum
CREATE TYPE "LeadProjectType" AS ENUM ('WEB_DEV', 'DIGITAL_MARKETING');

-- CreateEnum
CREATE TYPE "LeadMarketingFocus" AS ENUM ('DESIGN', 'PHOTO_VIDEO');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "marketingFocus" "LeadMarketingFocus",
ADD COLUMN     "projectType" "LeadProjectType";
