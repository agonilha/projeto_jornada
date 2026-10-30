import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PEDIDO_RECEBIDO: "Pedido recebido",
  EM_SEPARACAO: "Em separação",
  AGUARDANDO_CARREGAMENTO: "Aguardando carregamento",
  EM_CARREGAMENTO: "Em carregamento",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

export default async function ExpedicaoMotoristaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  if (session.user.role !== "MOTORISTA") {
    redirect("/");
  }

  const motorista = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!motorista || !motorista.isActive) {
    redirect("/");
  }

  const expedicao = await prisma.shipment.findFirst({
    where: {
      driverId: motorista.id,
      status: {
        notIn: ["FINALIZADA", "CANCELADA"],
      },
    },
    include: {
      yard: true,
      vehicle: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Link
        href="/motorista"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700"
      >
        <ArrowLeft size={18} />
        Voltar ao painel
      </Link>

      <div>
        <p className="text-sm font-semibold text-sky-700">
          ACOMPANHAMENTO
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Minha expedição
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Acompanhe o andamento da sua carga.
        </p>
      </div>

      {!expedicao ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <PackageCheck
            size={40}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Nenhuma expedição ativa
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quando uma nova carga for programada,
            suas informações aparecerão aqui.
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase text-sky-700">
              Carga atual
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-800">
              {expedicao.description}
            </h2>

            <div className="mt-4 inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800">
              {statusLabels[expedicao.status] ??
                expedicao.status}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <MapPin className="text-sky-700" size={22} />
                <p className="mt-3 text-xs text-slate-500">
                  Pátio designado
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {expedicao.yard.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <Truck className="text-sky-700" size={22} />
                <p className="mt-3 text-xs text-slate-500">
                  Veículo
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {expedicao.vehicle.plate}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <CalendarClock
                  className="text-sky-700"
                  size={22}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Agendamento
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {expedicao.scheduledAt.toLocaleString(
                    "pt-BR",
                    { timeZone: "America/Sao_Paulo" }
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800">
                Progresso do carregamento
              </h2>

              <span className="text-2xl font-bold text-sky-700">
                {expedicao.loadingProgress}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Progresso do carregamento"
              aria-valuenow={expedicao.loadingProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200"
            >
              <div
                className="h-full rounded-full bg-sky-600 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, expedicao.loadingProgress)
                  )}%`,
                }}
              />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              O progresso será atualizado pela equipe
              responsável pelo carregamento.
            </p>
          </section>
        </>
      )}
    </main>
  );
}