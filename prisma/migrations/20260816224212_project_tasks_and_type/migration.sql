-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('LANDING', 'CORPORATE', 'ECOMMERCE', 'SAAS', 'WEBAPP', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TaskPhase" AS ENUM ('DESIGN', 'DEVELOPMENT', 'CLIENT_REVIEW', 'QA', 'DELIVERY');

-- AlterTable
ALTER TABLE "PortfolioProject" ADD COLUMN     "projectType" "ProjectType";

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phase" "TaskPhase" NOT NULL,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
