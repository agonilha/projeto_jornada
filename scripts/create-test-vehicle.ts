import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const motorista = await prisma.user.findFirst({
    where: {
      role: "MOTORISTA",
      isActive: true,
      driverProfile: {
        isNot: null,
      },
    },
    include: {
      driverProfile: {
        include: {
          vehicles: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!motorista?.driverProfile) {
    throw new Error("Nenhum motorista cadastrado foi encontrado.");
  }

  if (motorista.driverProfile.vehicles.length > 0) {
    console.log("O motorista já possui um veículo cadastrado.");
    console.log("Motorista:", motorista.name);
    console.log("Placa:", motorista.driverProfile.vehicles[0].plate);
    return;
  }

  const veiculo = await prisma.vehicle.create({
    data: {
      plate: "JRN1A23",
      model: "FH 540",
      brand: "Volvo",
      color: "Branco",
      driverProfileId: motorista.driverProfile.id,
    },
  });

  console.log("Veículo cadastrado com sucesso!");
  console.log("Motorista:", motorista.name);
  console.log("Placa:", veiculo.plate);
  console.log("Modelo:", veiculo.model);
}

main()
  .catch((error) => {
    console.error("Erro:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });