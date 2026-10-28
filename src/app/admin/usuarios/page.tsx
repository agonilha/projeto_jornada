import UserStatusButton from "./UserStatusButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, ArrowLeft, UserRound } from "lucide-react";
import UserForm from "./UserForm";

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    ADMIN: "Administrador",
    SUPERVISOR: "Supervisor",
    PORTEIRO: "Porteiro",
    MOTORISTA: "Motorista",
  };

  return labels[role] ?? role;
}

function getRoleStyle(role: string) {
  const styles: Record<string, string> = {
    ADMIN: "bg-violet-100 text-violet-800",
    SUPERVISOR: "bg-blue-100 text-blue-800",
    PORTEIRO: "bg-amber-100 text-amber-800",
    MOTORISTA: "bg-emerald-100 text-emerald-800",
  };

  return styles[role] ?? "bg-slate-100 text-slate-800";
}

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

  const usuarios = await prisma.user.findMany({
  select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
  },
  orderBy: { createdAt: "desc" },
  });

  const formatarData = (data: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(data);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={isAdmin ? "/admin" : "/supervisor"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={18} />
          Voltar ao painel
        </Link>

        <header className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
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
            Cadastre e consulte os usuários responsáveis pela operação.
          </p>
        </header>

        {/* Formulário de cadastro */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Novo usuário
          </h2>

          <p className="mt-1 text-sm text-slate-700">
            Preencha os dados para cadastrar um novo acesso.
          </p>

          <UserForm isAdmin={isAdmin} />
        </section>

        {/* Listagem de usuários */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Usuários cadastrados
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Consulte os acessos registrados no sistema.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
              {usuarios.length}{" "}
              {usuarios.length === 1 ? "usuário" : "usuários"}
            </span>
          </div>

          {usuarios.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <UserRound
                size={36}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-semibold text-slate-800">
                Nenhum usuário cadastrado
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Os usuários criados aparecerão nesta lista.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      Nome
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      E-mail
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      Perfil
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      Status
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      Cadastro
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-700">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-900">
                          {usuario.name}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {usuario.email}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${getRoleStyle(usuario.role)}`}
                        >
                          {getRoleLabel(usuario.role)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                      <UserStatusButton
                          userId={usuario.id}
                          userName={usuario.name}
                          isActive={usuario.isActive}
                          isCurrentUser={usuario.id === session.user.id}
                      />
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                        {formatarData(usuario.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}