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
      category: "WEB_DEV",
    },
    create: {
      id: "seed-project-1",
      title: "Proyecto Demo",
      description: "Sitio web desarrollado a la medida.",
      projectUrl: "https://example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
      tags: ["Next.js", "Diseño Web"],
      category: "WEB_DEV",
      status: "COMPLETED",
      progress: 100,
      order: 0,
    },
  });

  await prisma.portfolioProject.upsert({
    where: { id: "seed-project-2" },
    update: { category: "DIGITAL_MARKETING" },
    create: {
      id: "seed-project-2",
      title: "Cliente Demo",
      description: "Campaña de marketing digital y gestión de redes sociales.",
      imageUrl:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
      tags: ["Redes sociales", "Ads"],
      category: "DIGITAL_MARKETING",
      status: "COMPLETED",
      progress: 100,
      order: 1,
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
      features: ["Diseño a medida", "1 año gratis de hosting y dominio", "Soporte 30 días"],
      order: 0,
    },
  });

  await prisma.service.upsert({
    where: { id: "seed-agency-package-1" },
    update: {},
    create: {
      id: "seed-agency-package-1",
      name: "Contenido Mensual",
      description: "Sesión de fotografía y video para redes sociales, una vez al mes.",
      price: 4500,
      features: ["1 sesión de foto/video", "10 piezas editadas", "Entrega en 5 días hábiles"],
      scope: "AGENCY",
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

  await prisma.legalPage.upsert({
    where: { id: "terms" },
    update: {},
    create: { id: "terms", title: "Términos y Condiciones", content: "TÉRMINOS Y CONDICIONES\n\nÚltima actualización: [fecha]\n\n1. Identificación\n\nEste sitio web es operado por Miguel Ceballos, bajo la marca JXRXNX BrandHouse (\"nosotros\", \"el prestador\"). Puedes contactarnos en miguelcq13@gmail.com para cualquier consulta relacionada con estos términos.\n\n2. Objeto\n\nEstos términos regulan el acceso y uso de este sitio web, así como la contratación de servicios de desarrollo web, marketing digital, fotografía, video y diseño gráfico ofrecidos a través de él.\n\n3. Uso del sitio\n\nAl usar este sitio aceptas hacerlo de forma lícita, sin dañar, inutilizar o sobrecargar el servicio, y sin realizar acciones que puedan afectar su normal funcionamiento o el de terceros.\n\n4. Solicitudes de contacto y agenda\n\nLos formularios de contacto, reseñas y solicitudes de agenda recopilan únicamente los datos necesarios para responder a tu consulta o coordinar un proyecto. Consulta nuestra Política de Privacidad para más detalle sobre el tratamiento de estos datos.\n\n5. Presupuestos y contratación de servicios\n\nLos precios mostrados en el sitio son orientativos y pueden ajustarse según el alcance real de cada proyecto. La contratación formal de cualquier servicio se confirma por escrito (correo electrónico u otro medio acordado) antes de iniciar el trabajo.\n\n6. Propiedad intelectual\n\nEl contenido de este sitio (textos, imágenes, diseño, código) es propiedad de Miguel Ceballos / JXRXNX BrandHouse o de sus clientes, según corresponda, y no puede reproducirse sin autorización, salvo que la ley lo permita.\n\n7. Enlaces a terceros\n\nEste sitio puede incluir enlaces a redes sociales o sitios de terceros. No somos responsables del contenido ni de las prácticas de privacidad de esos sitios externos.\n\n8. Limitación de responsabilidad\n\nHacemos un esfuerzo razonable para mantener el sitio disponible y actualizado, pero no garantizamos que esté libre de errores o interrupciones en todo momento.\n\n9. Modificaciones\n\nPodemos actualizar estos términos cuando sea necesario. La versión vigente siempre estará disponible en esta página, con la fecha de última actualización.\n\n10. Legislación aplicable\n\nEstos términos se rigen por la legislación aplicable en la jurisdicción del prestador, sin perjuicio de los derechos que la normativa de protección al consumidor de tu país de residencia pueda reconocerte." },
  });

  await prisma.legalPage.upsert({
    where: { id: "privacy" },
    update: {},
    create: { id: "privacy", title: "Política de Privacidad", content: "POLÍTICA DE PRIVACIDAD\n\nÚltima actualización: [fecha]\n\nEsta política se redacta conforme a los principios del Reglamento General de Protección de Datos de la Unión Europea (RGPD/GDPR) y explica cómo tratamos tus datos personales al usar este sitio.\n\n1. Responsable del tratamiento\n\nMiguel Ceballos, bajo la marca JXRXNX BrandHouse. Contacto: miguelcq13@gmail.com.\n\n2. Qué datos recopilamos\n\n- Formulario de contacto: nombre, correo electrónico y mensaje.\n- Solicitudes de agenda: nombre, empresa (opcional), correo, teléfono (opcional), método de contacto preferido y mensaje.\n- Reseñas públicas: nombre del autor, texto de la reseña y calificación.\n- Datos técnicos mínimos generados por el hosting (por ejemplo, dirección IP) para el funcionamiento y seguridad del sitio.\n\nNo solicitamos datos financieros, de salud ni ninguna categoría especial de datos a través de estos formularios.\n\n3. Finalidad y base legal\n\nUsamos estos datos para responder tus consultas, coordinar proyectos y, en el caso de las reseñas aprobadas, mostrarlas públicamente. La base legal es tu consentimiento al enviar el formulario correspondiente, y nuestro interés legítimo en dar seguimiento a solicitudes de negocio.\n\n4. Con quién compartimos tus datos\n\n- Resend: envío de las notificaciones por correo generadas por los formularios.\n- Vercel y Neon: alojamiento del sitio y de la base de datos.\n- Vercel Blob: almacenamiento de archivos multimedia subidos desde el panel de administración (no se suben archivos de visitantes).\n\nNo vendemos ni compartimos tus datos con terceros para fines publicitarios.\n\n5. Conservación\n\nConservamos tus datos mientras sean necesarios para atender tu solicitud o mientras exista una relación comercial, y los eliminamos cuando ya no se necesiten, salvo obligación legal de conservarlos por más tiempo.\n\n6. Tus derechos\n\nSi resides en la Unión Europea (o bajo normativa equivalente), tienes derecho a acceder, rectificar, eliminar, limitar u oponerte al tratamiento de tus datos, así como a la portabilidad de los mismos. Puedes ejercer estos derechos escribiendo a miguelcq13@gmail.com. También tienes derecho a presentar una reclamación ante la autoridad de protección de datos de tu país.\n\n7. Cookies\n\nEste sitio usa únicamente cookies técnicas necesarias para su funcionamiento (por ejemplo, la sesión del panel de administración) y una cookie propia para recordar tu preferencia de consentimiento de cookies. No usamos cookies de analítica ni publicidad de terceros. Si esto cambia en el futuro, actualizaremos esta política y el aviso de cookies antes de activarlas.\n\n8. Seguridad\n\nAplicamos medidas técnicas razonables (contraseñas cifradas, acceso restringido al panel de administración, conexión cifrada HTTPS) para proteger tus datos frente a accesos no autorizados.\n\n9. Transferencias internacionales\n\nAlgunos de nuestros proveedores (hosting, base de datos, correo) pueden procesar datos fuera de tu país de residencia. En esos casos, dependemos de las garantías de protección de datos que dichos proveedores ofrecen.\n\n10. Cambios a esta política\n\nPodemos actualizar esta política cuando sea necesario. La fecha de la última actualización siempre aparece al inicio de esta página." },
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
