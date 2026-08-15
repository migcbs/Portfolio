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

  const heroImageUrl =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80";

  const logoUrl = "/logo.png";

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { heroImageUrl, logoUrl },
    create: { id: "singleton", heroImageUrl, logoUrl },
  });

  const client = await prisma.client.upsert({
    where: { id: "seed-client-1" },
    update: {
      logoUrl:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80",
    },
    create: {
      id: "seed-client-1",
      name: "Cliente Demo",
      website: "https://example.com",
      logoUrl:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80",
      order: 0,
    },
  });

  const stories = [
    {
      id: "seed-story-1",
      category: "PHOTO" as const,
      type: "IMAGE" as const,
      mediaUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=720&q=80",
    },
    {
      id: "seed-story-2",
      category: "PHOTO" as const,
      type: "IMAGE" as const,
      mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&q=80",
    },
    {
      id: "seed-story-3",
      category: "VIDEO" as const,
      type: "VIDEO" as const,
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: "seed-story-4",
      category: "MERCH" as const,
      type: "IMAGE" as const,
      mediaUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=720&q=80",
    },
    {
      id: "seed-story-5",
      category: "MERCH" as const,
      type: "IMAGE" as const,
      mediaUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=720&q=80",
    },
  ];
  for (const [i, story] of stories.entries()) {
    await prisma.story.upsert({
      where: { id: story.id },
      update: { mediaUrl: story.mediaUrl, category: story.category, type: story.type },
      create: {
        id: story.id,
        clientId: client.id,
        category: story.category,
        type: story.type,
        mediaUrl: story.mediaUrl,
        order: i,
      },
    });
  }

  await prisma.portfolioProject.upsert({
    where: { id: "seed-project-1" },
    update: {
      imageUrl:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      id: "seed-project-1",
      title: "Proyecto Demo",
      description: "Sitio web desarrollado a la medida.",
      projectUrl: "https://example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
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

  const socialLinks = [
    { id: "seed-social-instagram", label: "Instagram", url: "https://instagram.com/tuusuario" },
    { id: "seed-social-facebook", label: "Facebook", url: "https://facebook.com/tuusuario" },
    { id: "seed-social-tiktok", label: "TikTok", url: "https://tiktok.com/@tuusuario" },
    { id: "seed-social-linkedin", label: "LinkedIn", url: "https://linkedin.com/in/tuusuario" },
    { id: "seed-social-whatsapp", label: "WhatsApp", url: "https://wa.me/521234567890" },
  ];
  for (const [i, link] of socialLinks.entries()) {
    await prisma.socialLink.upsert({
      where: { id: link.id },
      update: { url: link.url },
      create: { id: link.id, label: link.label, url: link.url, scope: "PERSONAL", order: i },
    });
  }

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
