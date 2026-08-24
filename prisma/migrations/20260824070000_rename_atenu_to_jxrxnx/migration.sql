-- Rename columns to match the JXRXNX rebrand (preserves existing data)
ALTER TABLE "SiteSettings" RENAME COLUMN "atenuIntro" TO "jxrxnxIntro";
ALTER TABLE "SiteSettings" RENAME COLUMN "atenuCustomText" TO "jxrxnxCustomText";

-- Update the column default expressions to match
ALTER TABLE "SiteSettings" ALTER COLUMN "jxrxnxIntro" SET DEFAULT 'Ayudamos a marcas a verse y sonar como se sienten: fotografía, video, diseño e impresión bajo un mismo equipo.';
ALTER TABLE "SiteSettings" ALTER COLUMN "jxrxnxCustomText" SET DEFAULT '¿Tu negocio necesita algo distinto? También armamos soluciones a la medida, fuera de estos paquetes.';
ALTER TABLE "SiteSettings" ALTER COLUMN "agencyBrand" SET DEFAULT 'JXRXNX BrandHouse';
