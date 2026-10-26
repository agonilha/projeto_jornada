import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function SupervisorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");

  if (session.user.role !== "SUPERVISOR") {
    if (session.user.role === "PORTEIRO") redirect("/porteiro");
    if (session.user.role === "MOTORISTA") redirect("/motorista");
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl bg-emerald-900 p-6 text-white">
          <p className="text-sm text-emerald-200">FastTrack</p>
          <h1 className="mt-2 text-3xl font-bold">
            Painel do Supervisor
          </h1>
          <p className="mt-2 text-emerald-100">
            Bem-vindo, {session.user.name ?? "supervisor"}.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Movimentações</h2>
            <p className="mt-2 text-sm text-slate-600">
              Acompanhe entradas e saídas do pátio.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Indicadores</h2>
            <p className="mt-2 text-sm text-slate-600">
              Consulte os indicadores operacionais.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Equipe</h2>
            <p className="mt-2 text-sm text-slate-600">
              Área de acompanhamento da equipe.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}