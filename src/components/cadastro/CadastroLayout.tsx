import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CadastroLayoutProps {
  titulo: string;
  descricao: string;
  children: ReactNode;
}

export default function CadastroLayout({
  titulo,
  descricao,
  children,
}: CadastroLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Voltar ao login
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
              Jornada
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {titulo}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {descricao}
            </p>
          </header>

          <div>{children}</div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Jornada — Gestão de pátios e carregamentos
        </p>
      </div>
    </main>
  );
}