import LoadingProgressForm from "@/components/supervisor/LoadingProgressForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ClipboardList,
  PackageCheck,
  Truck,
  MapPin,
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

export default async function SupervisorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  if (
    session.user.role !== "SUPERVISOR" &&
    session.user.role !== "ADMIN"
  ) {
    if (session.user.role === "PORTEIRO") {
      redirect("/porteiro");
    }

    if (session.user.role === "MOTORISTA") {
      redirect("/motorista");
    }

    redirect("/");
  }

  const expedicoes = await prisma.shipment.findMany({
    include: {
      driver: {
        select: {
          name: true,
        },
      },
      vehicle: {
        select: {
          plate: true,
        },
      },
      yard: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      scheduledAt: "desc",
    },
    take: 50,
  });

  const ativas = expedicoes.filter(
    (expedicao) =>
      expedicao.status !== "FINALIZADA" &&
      expedicao.status !== "CANCELADA"
  );

  const emCarregamento = expedicoes.filter(
    (expedicao) => expedicao.status === "EM_CARREGAMENTO"
  );

  const finalizadas = expedicoes.filter(
    (expedicao) => expedicao.status === "FINALIZADA"
  );

  return (
    <main className="min-h-screen min-w-0 bg-slate-100 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5">
        <header className="rounded-2xl bg-emerald-900 p-6 text-white">
          <p className="text-sm text-emerald-200">
            Jornada
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Painel do Supervisor
          </h1>

          <p className="mt-2 text-emerald-100">
            Bem-vindo, {session.user.name ?? "supervisor"}.
          </p>

          <p className="mt-3 text-sm text-emerald-200">
            Acompanhe as expedições e o progresso dos carregamentos.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ClipboardList className="text-sky-700" size={26} />
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {ativas.length}
            </p>
            <p className="text-sm text-slate-500">
              Expedições ativas
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <Truck className="text-amber-600" size={26} />
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {emCarregamento.length}
            </p>
            <p className="text-sm text-slate-500">
              Em carregamento
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <PackageCheck className="text-emerald-700" size={26} />
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {finalizadas.length}
            </p>
            <p className="text-sm text-slate-500">
              Finalizadas
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Expedições
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Últimas 50 expedições cadastradas, ordenadas pelo agendamento.
            </p>
          </div>

          {expedicoes.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-semibold text-slate-700">
                Nenhuma expedição encontrada.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                As expedições cadastradas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {expedicoes.map((expedicao) => (
                <article
                  key={expedicao.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-emerald-700">
                        Expedição
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-800">
                        {expedicao.description}
                      </h3>
                    </div>

                    <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800">
                      {statusLabels[expedicao.status] ??
                        expedicao.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Motorista
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {expedicao.driver.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Veículo
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {expedicao.vehicle.plate}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={14} />
                        Pátio
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {expedicao.yard.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">
                        Progresso do carregamento
                      </p>

                      <span className="font-bold text-emerald-700">
                        {expedicao.loadingProgress}%
                      </span>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, expedicao.loadingProgress)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <LoadingProgressForm
                    key={`${expedicao.id}-${expedicao.loadingProgress}-${expedicao.status}`}
                    expedicaoId={expedicao.id}
                    progressoAtual={expedicao.loadingProgress}
                    status={expedicao.status}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}