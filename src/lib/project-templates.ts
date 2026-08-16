export const PROJECT_TYPE_LABELS: Record<string, string> = {
  LANDING: "Landing page informativa",
  CORPORATE: "Sitio corporativo",
  ECOMMERCE: "E-commerce",
  SAAS: "SaaS",
  WEBAPP: "Web app a medida",
  CUSTOM: "Personalizado / otro",
};

export const TASK_PHASE_LABELS: Record<string, string> = {
  DESIGN: "Diseño",
  DEVELOPMENT: "Desarrollo",
  CLIENT_REVIEW: "Cliente",
  QA: "Control de calidad",
  DELIVERY: "Entrega",
};

export const TASK_PHASES = ["DESIGN", "DEVELOPMENT", "CLIENT_REVIEW", "QA", "DELIVERY"] as const;

type TemplateItem = { phase: (typeof TASK_PHASES)[number]; label: string };

// Starting-point checklists per project type — fully editable per project
// afterward (add/remove/rename freely), these just save retyping the usual
// steps for that kind of build.
export const PROJECT_TEMPLATES: Record<string, TemplateItem[]> = {
  LANDING: [
    { phase: "DESIGN", label: "Wireframe de una página" },
    { phase: "DESIGN", label: "Definir paleta y tipografía" },
    { phase: "DEVELOPMENT", label: "Maquetar hero y secciones" },
    { phase: "DEVELOPMENT", label: "Formulario de contacto" },
    { phase: "DEVELOPMENT", label: "SEO básico (meta tags, sitemap, OG image)" },
    { phase: "CLIENT_REVIEW", label: "Enviar preview al cliente" },
    { phase: "CLIENT_REVIEW", label: "Ronda de ajustes" },
    { phase: "QA", label: "Probar en móvil y desktop" },
    { phase: "QA", label: "Revisar velocidad de carga" },
    { phase: "DELIVERY", label: "Conectar dominio y hosting" },
    { phase: "DELIVERY", label: "Entregar accesos" },
  ],
  CORPORATE: [
    { phase: "DESIGN", label: "Mapa del sitio" },
    { phase: "DESIGN", label: "Wireframes de páginas clave" },
    { phase: "DEVELOPMENT", label: "Maquetar páginas" },
    { phase: "DEVELOPMENT", label: "CMS / panel para editar contenido" },
    { phase: "DEVELOPMENT", label: "Formularios (contacto, cotización)" },
    { phase: "CLIENT_REVIEW", label: "Enviar preview al cliente" },
    { phase: "CLIENT_REVIEW", label: "Ronda de ajustes" },
    { phase: "QA", label: "Revisar todos los enlaces y formularios" },
    { phase: "QA", label: "Probar en móvil y desktop" },
    { phase: "DELIVERY", label: "Conectar dominio y hosting" },
    { phase: "DELIVERY", label: "Capacitación de uso del CMS" },
  ],
  ECOMMERCE: [
    { phase: "DESIGN", label: "Flujo de compra (carrito → checkout)" },
    { phase: "DESIGN", label: "Wireframes de catálogo y producto" },
    { phase: "DEVELOPMENT", label: "Catálogo de productos" },
    { phase: "DEVELOPMENT", label: "Carrito y checkout" },
    { phase: "DEVELOPMENT", label: "Integración de pagos" },
    { phase: "DEVELOPMENT", label: "Cálculo de envíos" },
    { phase: "CLIENT_REVIEW", label: "Demo del flujo de compra al cliente" },
    { phase: "CLIENT_REVIEW", label: "Ronda de ajustes" },
    { phase: "QA", label: "Probar compra de extremo a extremo" },
    { phase: "QA", label: "Probar pagos en modo prueba" },
    { phase: "DELIVERY", label: "Pasar pagos a modo producción" },
    { phase: "DELIVERY", label: "Capacitación de gestión de pedidos" },
  ],
  SAAS: [
    { phase: "DESIGN", label: "Flujo de usuario (user journey)" },
    { phase: "DESIGN", label: "Wireframes de pantallas clave" },
    { phase: "DEVELOPMENT", label: "Modelo de base de datos" },
    { phase: "DEVELOPMENT", label: "Autenticación de usuarios" },
    { phase: "DEVELOPMENT", label: "Integración de pagos/suscripciones" },
    { phase: "DEVELOPMENT", label: "Panel de administración" },
    { phase: "CLIENT_REVIEW", label: "Demo del MVP al cliente" },
    { phase: "CLIENT_REVIEW", label: "Ronda de ajustes" },
    { phase: "QA", label: "Probar flujos críticos de extremo a extremo" },
    { phase: "QA", label: "Revisar seguridad y permisos" },
    { phase: "DELIVERY", label: "Desplegar a producción" },
    { phase: "DELIVERY", label: "Documentación y capacitación" },
  ],
  WEBAPP: [
    { phase: "DESIGN", label: "Flujo de usuario (user journey)" },
    { phase: "DESIGN", label: "Wireframes de pantallas clave" },
    { phase: "DEVELOPMENT", label: "Modelo de datos" },
    { phase: "DEVELOPMENT", label: "Lógica principal de la aplicación" },
    { phase: "DEVELOPMENT", label: "Integraciones externas necesarias" },
    { phase: "CLIENT_REVIEW", label: "Demo al cliente" },
    { phase: "CLIENT_REVIEW", label: "Ronda de ajustes" },
    { phase: "QA", label: "Probar flujos críticos" },
    { phase: "DELIVERY", label: "Desplegar a producción" },
    { phase: "DELIVERY", label: "Documentación y capacitación" },
  ],
  CUSTOM: [],
};
