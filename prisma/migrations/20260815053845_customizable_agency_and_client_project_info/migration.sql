-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "agencyServices" TEXT[] DEFAULT ARRAY['Fotografía', 'Video', 'Diseño gráfico', 'Impresiones', 'Merch']::TEXT[],
ADD COLUMN     "agencyTagline" TEXT NOT NULL DEFAULT 'Agencia de marketing digital.';
