import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "miguelcq13@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-locally";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: await hashPassword(adminPassword) },
  });

  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({ data: {} });
  }

  const client = await prisma.client.upsert({
    where: { id: "seed-client-1" },
    update: {},
    create: {
      id: "seed-client-1",
      name: "Cliente Demo",
      website: "https://example.com",
      order: 0,
    },
  });

  await prisma.story.upsert({
    where: { id: "seed-story-1" },
    update: {},
    create: {
      id: "seed-story-1",
      clientId: client.id,
      type: "IMAGE",
      mediaUrl: "https://placehold.co/720x1280/000000/FFFFFF?text=Story+Demo",
      order: 0,
    },
  });

  await prisma.portfolioProject.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "Proyecto Demo",
      description: "Sitio web desarrollado a la medida.",
      projectUrl: "https://example.com",
      tags: ["Next.js", "Diseño Web"],
      order: 0,
    },
  });

  await prisma.service.upsert({
    where: { id: "seed-package-1" },
    update: {},
    create: {
      id: "seed-package-1",
      name: "Paquete Esencial",
      description: "Sitio web de una página, optimizado y responsivo.",
      price: 8000,
      features: ["Diseño a medida", "Hosting incluido 1 año", "Soporte 30 días"],
      order: 0,
    },
  });

  await prisma.review.upsert({
    where: { id: "seed-review-1" },
    update: {},
    create: {
      id: "seed-review-1",
      authorName: "Cliente Satisfecho",
      text: "Excelente trabajo, entrega puntual y gran comunicación.",
      rating: 5,
      approved: true,
    },
  });

  console.log("Seed completado. Admin:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
