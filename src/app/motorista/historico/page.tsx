import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  MapPin,
  Truck,
} from "lucide-react";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HistoricoMotoristaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  if (session.user.role !== "MOTORISTA") {
    redirect("/");
  }

  const motorista = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!motorista || !motorista.isActive) {
    redirect("/");
  }

  const expedicoes = await prisma.shipment.findMany({
    where: {
      driverId: motorista.id,
      status: {
        in: ["FINALIZADA", "CANCELADA"],
      },
    },
    include: {
      yard: true,
      vehicle: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/motorista"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700"
      >
        <ArrowLeft size={18} />
        Voltar ao painel
      </Link>

      <header>
        <p className="text-sm font-semibold text-sky-700">
          MINHAS EXPEDIÇÕES
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
          Histórico de carregamentos
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Consulte suas últimas expedições finalizadas ou canceladas.
        </p>
      </header>

      {expedicoes.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ClipboardList
            size={40}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Nenhuma expedição no histórico
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quando suas expedições forem encerradas,
            elas aparecerão aqui.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {expedicoes.map((expedicao) => (
            <article
              key={expedicao.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="min-w-0 text-lg font-bold text-slate-800">
                  {expedicao.description}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    expedicao.status === "FINALIZADA"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {expedicao.status === "FINALIZADA"
                    ? "Finalizada"
                    : "Cancelada"}
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                <div className="flex items-start gap-2">
                  <Truck size={18} className="shrink-0 text-sky-700" />
                  <div>
                    <p className="text-xs text-slate-500">
                      Veículo
                    </p>
                    <p className="font-semibold text-slate-800">
                      {expedicao.vehicle.plate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={18} className="shrink-0 text-sky-700" />
                  <div>
                    <p className="text-xs text-slate-500">
                      Pátio
                    </p>
                    <p className="font-semibold text-slate-800">
                      {expedicao.yard.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays
                    size={18}
                    className="shrink-0 text-sky-700"
                  />
                  <div>
                    <p className="text-xs text-slate-500">
                      Última atualização
                    </p>
                    <p className="font-semibold text-slate-800">
                      {expedicao.updatedAt.toLocaleDateString(
                        "pt-BR",
                        { timeZone: "America/Sao_Paulo" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}