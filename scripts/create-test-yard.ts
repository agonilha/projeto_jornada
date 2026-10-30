import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const patioExistente = await prisma.yard.findFirst({
    where: {
      name: "Pátio 01",
    },
  });

  if (patioExistente) {
    console.log("O Pátio 01 já está cadastrado.");
    console.log("ID:", patioExistente.id);
    return;
  }

  const patio = await prisma.yard.create({
    data: {
      name: "Pátio 01",
      address: "Pátio de demonstração - Jornada MVP",
    },
  });

  console.log("Pátio cadastrado com sucesso!");
  console.log("ID:", patio.id);
  console.log("Nome:", patio.name);
}

main()
  .catch((error) => {
    console.error("Erro:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });