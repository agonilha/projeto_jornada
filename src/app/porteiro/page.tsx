import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function PorteiroPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "PORTEIRO") {
    switch (session.user.role) {
      case "MOTORISTA":
        redirect("/motorista");
      case "SUPERVISOR":
        redirect("/supervisor");
      default:
        redirect("/");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-sm text-slate-300">
            FastTrack
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Painel do Porteiro
          </h1>
          <p className="mt-2 text-slate-300">
            Bem-vindo, {session.user.name ?? "usuário"}.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Registrar entrada
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Registrar a chegada de veículos e motoristas.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Consultar movimentações
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Consultar as movimentações do pátio.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Registrar saída
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Registrar a saída de veículos.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}