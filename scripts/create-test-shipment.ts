import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const motorista = await prisma.user.findFirst({
    where: {
      role: "MOTORISTA",
      isActive: true,
      driverProfile: {
        is: {
          vehicles: {
            some: {},
          },
        },
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
    throw new Error(
      "Nenhum motorista ativo com veículo cadastrado foi encontrado."
    );
  }

  const veiculo = motorista.driverProfile.vehicles[0];

  const patio = await prisma.yard.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!patio) {
    throw new Error(
      "Nenhum pátio cadastrado foi encontrado."
    );
  }

  const expedicaoExistente = await prisma.shipment.findFirst({
    where: {
      driverId: motorista.id,
      status: {
        notIn: ["FINALIZADA", "CANCELADA"],
      },
    },
  });

  if (expedicaoExistente) {
    console.log(
      "Este motorista já possui uma expedição ativa:",
      expedicaoExistente.id
    );
    return;
  }

  const expedicao = await prisma.shipment.create({
    data: {
      description: "Carga de teste - Jornada MVP",
      driverId: motorista.id,
      vehicleId: veiculo.id,
      yardId: patio.id,
      status: "AGUARDANDO_CARREGAMENTO",
      loadingProgress: 0,
      scheduledAt: new Date(),
      notes: "Expedição criada para demonstração do MVP.",
    },
  });

  console.log("Expedição criada com sucesso!");
  console.log("ID:", expedicao.id);
  console.log("Motorista:", motorista.name);
  console.log("Veículo:", veiculo.plate);
  console.log("Pátio:", patio.name);
  console.log("Status:", expedicao.status);
}

main()
  .catch((error) => {
    console.error("Erro:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });