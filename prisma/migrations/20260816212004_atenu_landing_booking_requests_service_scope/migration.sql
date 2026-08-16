-- CreateEnum
CREATE TYPE "ServiceScope" AS ENUM ('PERSONAL', 'AGENCY');

-- CreateEnum
CREATE TYPE "PreferredContact" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "scope" "ServiceScope" NOT NULL DEFAULT 'PERSONAL';

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "atenuCustomText" TEXT NOT NULL DEFAULT '¿Tu negocio necesita algo distinto? También armamos soluciones a la medida, fuera de estos paquetes.',
ADD COLUMN     "atenuIntro" TEXT NOT NULL DEFAULT 'Ayudamos a marcas a verse y sonar como se sienten: fotografía, video, diseño e impresión bajo un mismo equipo.';

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredContact" "PreferredContact" NOT NULL DEFAULT 'EMAIL',
    "message" TEXT,
    "source" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);
