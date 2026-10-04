-- The site is now web-development only and packages no longer show prices.
-- Non-destructive: marketing data stays in the database but is hidden from
-- the public site; only copy that still matches the old defaults is rewritten.

ALTER TABLE "SiteSettings" ALTER COLUMN "agencyTagline" SET DEFAULT 'Desarrollo web a la medida.';
ALTER TABLE "SiteSettings" ALTER COLUMN "agencyServices" SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "SiteSettings" ALTER COLUMN "jxrxnxIntro" SET DEFAULT 'Sitios y aplicaciones web a la medida: diseño, desarrollo, hosting y soporte bajo un mismo equipo.';
ALTER TABLE "SiteSettings" ALTER COLUMN "jxrxnxCustomText" SET DEFAULT '¿Tu proyecto necesita algo distinto? También desarrollamos soluciones a la medida, fuera de estos paquetes.';

UPDATE "SiteSettings" SET "agencyTagline" = 'Desarrollo web a la medida.'
  WHERE "agencyTagline" = 'Agencia de marketing digital.';
UPDATE "SiteSettings" SET "jxrxnxIntro" = 'Sitios y aplicaciones web a la medida: diseño, desarrollo, hosting y soporte bajo un mismo equipo.'
  WHERE "jxrxnxIntro" = 'Ayudamos a marcas a verse y sonar como se sienten: fotografía, video, diseño e impresión bajo un mismo equipo.';
UPDATE "SiteSettings" SET "jxrxnxCustomText" = '¿Tu proyecto necesita algo distinto? También desarrollamos soluciones a la medida, fuera de estos paquetes.'
  WHERE "jxrxnxCustomText" = '¿Tu negocio necesita algo distinto? También armamos soluciones a la medida, fuera de estos paquetes.';
UPDATE "SiteSettings" SET "agencyServices" = ARRAY[]::TEXT[];

-- Hide agency (photo/video/design) packages and clear package prices.
UPDATE "Service" SET "active" = false WHERE "scope" = 'AGENCY';
UPDATE "Service" SET "price" = NULL;

-- Legal copy: drop marketing services and the "orientative prices" clause.
UPDATE "LegalPage" SET "content" = replace("content",
  'la contratación de servicios de desarrollo web, marketing digital, fotografía, video y diseño gráfico ofrecidos a través de él.',
  'la contratación de servicios de desarrollo web ofrecidos a través de él.')
  WHERE "id" = 'terms';
UPDATE "LegalPage" SET "content" = replace("content",
  'Los precios mostrados en el sitio son orientativos y pueden ajustarse según el alcance real de cada proyecto.',
  'Los paquetes publicados en el sitio son descriptivos y no incluyen precios: cada proyecto se cotiza de forma personalizada según su alcance y necesidades.')
  WHERE "id" = 'terms';
