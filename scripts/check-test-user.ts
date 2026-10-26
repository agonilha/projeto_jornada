import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
  const email = "admin2@fasttrack.com";
  const password = "teste123";

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("RESULTADO: usuário não encontrado no banco.");
    return;
  }

  console.log("Usuário encontrado:", user.email);
  console.log("Perfil:", user.role);
  console.log("Hash armazenado:", user.password);

  const passwordIsValid = await bcrypt.compare(
    password,
    user.password,
  );

  console.log("Senha corresponde ao hash:", passwordIsValid);
}

main()
  .catch((error) => {
    console.error("Erro ao consultar usuário:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });