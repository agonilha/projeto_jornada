import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Users, ShieldCheck } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    if (session.user.role === "SUPERVISOR") redirect("/supervisor");
    if (session.user.role === "PORTEIRO") redirect("/porteiro");
    if (session.user.role === "MOTORISTA") redirect("/motorista");

    redirect("/");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} />
            <div>
              <p className="text-sm text-slate-300">FastTrack</p>
              <h1 className="text-3xl font-bold">
                Painel do Administrador
              </h1>
            </div>
          </div>

          <p className="mt-3 text-slate-300">
            Bem-vindo, {session.user.name ?? "administrador"}.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/usuarios"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <Users size={28} className="text-sky-700" />

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              Gerenciar usuários
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Acesse o cadastro e o gerenciamento de usuários do sistema.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-sky-700">
              Acessar →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}