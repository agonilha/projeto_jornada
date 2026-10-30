import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
  const email = "adminn@fasttrack.com";
  const password = "teste123";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Admin de Teste",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin de Teste",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Usuário de teste criado/atualizado:", user.email);
}

main()
  .catch((error) => {
    console.error("Erro ao criar usuário:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });