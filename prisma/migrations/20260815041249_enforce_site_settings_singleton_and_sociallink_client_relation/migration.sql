-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "id" SET DEFAULT 'singleton';

-- AlterTable
ALTER TABLE "SocialLink" ADD COLUMN     "clientId" TEXT;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
