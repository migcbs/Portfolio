// Resets an admin password directly in the database pointed to by DATABASE_URL.
// ADMIN_PASSWORD only seeds the *first* admin user; after that, login checks
// the hash stored in the DB, so changing the env var alone has no effect.
//
// Usage (production): npx tsx scripts/reset-admin-password.ts --ask-url
// --ask-url prompts (hidden) for the Neon connection string, since Vercel
// won't let `vercel env pull` download sensitive values.
import readline from "node:readline";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

function ask(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) {
    // Echo nothing while the password is typed.
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => {
      if (s.includes(question)) process.stdout.write(s);
    };
  }
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    })
  );
}

async function main() {
  const envUrl = process.env.DATABASE_URL;
  const url =
    process.argv.includes("--ask-url") || !envUrl || envUrl.includes("SENSITIVE")
      ? await ask("Pega la connection string de Neon (postgresql://...): ", true)
      : envUrl;
  if (!url.startsWith("postgres")) throw new Error("La connection string debe empezar con postgresql://");
  const host = new URL(url).host;
  const prisma = new PrismaClient({ datasourceUrl: url });

  try {
    const users = await prisma.user.findMany({ select: { email: true, lockedUntil: true, failedLoginAttempts: true } });
    console.log(`\nBase de datos: ${host}`);
    console.log("Usuarios admin existentes:");
    users.forEach((u) =>
      console.log(`  - ${u.email}${u.lockedUntil && u.lockedUntil > new Date() ? "  (BLOQUEADO por intentos fallidos)" : ""}`)
    );

    const defaultEmail = users[0]?.email ?? process.env.ADMIN_EMAIL ?? "";
    const email = (await ask(`\nEmail del admin [${defaultEmail}]: `)) || defaultEmail;
    const exists = users.some((u) => u.email === email);
    if (!exists) console.log(`No existe un admin con ${email}; se creará.`);

    const password = await ask("Nueva contraseña (mín. 8 caracteres): ", true);
    if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
    const confirm = await ask("Repite la contraseña: ", true);
    if (confirm !== password) throw new Error("Las contraseñas no coinciden.");

    const ok = await ask(`¿Guardar la nueva contraseña para ${email} en ${host}? (s/n): `);
    if (ok.toLowerCase() !== "s") {
      console.log("Cancelado. No se cambió nada.");
      return;
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
      create: { email, passwordHash },
    });
    console.log(`\nListo: contraseña actualizada para ${email} y bloqueo reiniciado.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(`\nError: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
