import { prisma } from "@/lib/prisma";
import { LegalForm } from "./legal-form";
import { updateTermsPage, updatePrivacyPage } from "./actions";

export default async function AdminLegalSettingsPage() {
  const [terms, privacy] = await Promise.all([
    prisma.legalPage.findUnique({ where: { id: "terms" } }),
    prisma.legalPage.findUnique({ where: { id: "privacy" } }),
  ]);

  return (
    <div>
      <LegalForm
        id="terms"
        label="Términos y condiciones"
        action={updateTermsPage}
        defaultValues={{
          title: terms?.title ?? "Términos y Condiciones",
          content: terms?.content ?? "",
        }}
      />
      <LegalForm
        id="privacy"
        label="Política de privacidad"
        action={updatePrivacyPage}
        defaultValues={{
          title: privacy?.title ?? "Política de Privacidad",
          content: privacy?.content ?? "",
        }}
      />
    </div>
  );
}
