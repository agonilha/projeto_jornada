import prisma from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany();

  console.log("Conexão com o banco OK!");
  console.log("Quantidade de usuários:", users.length);
}

main()
  .catch((error) => {
    console.error("Erro ao conectar ao banco:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });