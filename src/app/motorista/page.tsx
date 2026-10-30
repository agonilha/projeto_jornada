import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import VehicleCard from "@/components/motorista/VehicleCard";
import NextShipmentCard from "@/components/motorista/NextShipmentCard";
import LoadingHistoryCard from "@/components/motorista/LoadingHistoryCard";

export default async function DriverHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "MOTORISTA") {
    switch (session.user.role) {
      case "PORTEIRO":
        redirect("/porteiro");
      case "SUPERVISOR":
        redirect("/supervisor");
      case "ADMIN":
        redirect("/admin");
      default:
        redirect("/");
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    include: {
      driverProfile: {
        include: {
          vehicles: true,
        },
      },
    },
  });

  if (!user || !user.driverProfile) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Perfil de motorista não encontrado
        </h1>
        <p className="mt-2 text-slate-600">
          Entre em contato com o suporte para verificar seu cadastro.
        </p>
      </main>
    );
  }

  const agora = new Date();
  const inicioDoDia = new Date(agora);
  inicioDoDia.setHours(0, 0, 0, 0);

  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [proximaExpedicao, totalFinalizadas, finalizadasNoMes, finalizadasHoje] =
    await Promise.all([
      prisma.shipment.findFirst({
        where: {
          driverId: user.id,
          status: {
            notIn: ["FINALIZADA", "CANCELADA"],
          },
        },
        include: {
          yard: true,
        },
        orderBy: {
          scheduledAt: "asc",
        },
      }),

      prisma.shipment.count({
        where: {
          driverId: user.id,
          status: "FINALIZADA",
        },
      }),

      prisma.shipment.count({
        where: {
          driverId: user.id,
          status: "FINALIZADA",
          updatedAt: {
            gte: inicioDoMes,
          },
        },
      }),

      prisma.shipment.count({
        where: {
          driverId: user.id,
          status: "FINALIZADA",
          updatedAt: {
            gte: inicioDoDia,
          },
        },
      }),
    ]);

  const veiculo = user.driverProfile.vehicles[0];

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <p className="text-sm font-medium text-sky-700">
          PAINEL DO MOTORISTA
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl">
          Seu dia, em movimento.
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Olá, {user.name}. Confira seu veículo e acompanhe suas operações.
        </p>
      </div>

      <VehicleCard
        plate={veiculo?.plate ?? "Nenhum veículo cadastrado"}
        status={veiculo ? "Cadastrado" : "Pendente"}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <NextShipmentCard
          yard={proximaExpedicao?.yard.name ?? "Nenhuma expedição"}
          dock={
            proximaExpedicao
              ? proximaExpedicao.status.replaceAll("_", " ")
              : "Aguardando"
          }
        />

        <LoadingHistoryCard
          total={totalFinalizadas}
          thisMonth={finalizadasNoMes}
          today={finalizadasHoje}
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <ShieldCheck
          className="mt-0.5 shrink-0 text-sky-700"
          size={21}
        />

        <div>
          <p className="text-sm font-semibold text-sky-950">
            Mantenha-se atualizado
          </p>

          <p className="mt-1 text-xs leading-relaxed text-sky-800">
            Consulte as informações da sua próxima carga antes de se dirigir
            ao pátio.
          </p>
        </div>
      </div>
    </main>
  );
}