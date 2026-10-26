import VehicleCard from "@/components/motorista/VehicleCard";
import NextShipmentCard from "@/components/motorista/NextShipmentCard";
import LoadingHistoryCard from "@/components/motorista/LoadingHistoryCard";
import { ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

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
default:
redirect("/");
}
}
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <p className="text-sm font-medium text-sky-700">
          PAINEL DO MOTORISTA
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-700 tracking-tight sm:text-3xl">
          Seu dia, em movimento.
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Confira seu veículo e acompanhe suas operações.
        </p>
      </div>

      <VehicleCard
        plate="ABC-1D23"
        status="Ativo"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <NextShipmentCard
          yard="Pátio 01"
          dock="Doca 01"
        />

        <LoadingHistoryCard
          total={25}
          thisMonth={5}
          today={3}
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
            Consulte a orientação da sua próxima carga antes de se
            dirigir ao pátio.
          </p>
        </div>
      </div>
    </main>
  );
}