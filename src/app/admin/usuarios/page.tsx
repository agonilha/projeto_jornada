import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import UserForm from "./UserForm";

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const role = session.user.role;

  if (role !== "ADMIN" && role !== "SUPERVISOR") {
    if (role === "PORTEIRO") redirect("/porteiro");
    if (role === "MOTORISTA") redirect("/motorista");
    redirect("/");
  }

  const isAdmin = role === "ADMIN";

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={isAdmin ? "/admin" : "/supervisor"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Voltar ao painel
        </Link>

        <header className="rounded-2xl bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <Users size={30} />
            <div>
              <p className="text-sm text-slate-300">FastTrack</p>
              <h1 className="text-2xl font-bold">
                Gerenciamento de usuários
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            Cadastre os usuários responsáveis pela operação do sistema.
          </p>
        </header>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Novo usuário
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados para cadastrar um novo acesso.
          </p>

          <UserForm isAdmin={isAdmin} />
        </section>
      </div>
    </main>
  );
}