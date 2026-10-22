"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  House,
  LogOut,
  Package,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

const driver = {
  id: "MOTORISTA-001",
  name: "Carlos Silva",
  vehiclePlate: "ABC-1D23",
  yard: "Pátio 01",
  dock: "Doca 01",
};

const statistics = [
  { label: "Total", value: 25 },
  { label: "Este mês", value: 5 },
  { label: "Hoje", value: 3 },
];

export default function DriverHomePage() {
  const [qrOpen, setQrOpen] = useState(false);
  const [notice, setNotice] = useState("");

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <main className="min-h-dvh bg-slate-50 pb-28 text-slate-900">
      {/* Header */}
      <header className="bg-[#0B1424] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600">
              <Truck size={26} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-300">
                Bem-vindo,
              </p>
              <h1 className="truncate text-lg font-bold sm:text-xl">
                {driver.name}
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Área do motorista
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              aria-label="Mostrar meu QR Code"
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <QrCode size={21} />
            </button>

            <button
              type="button"
              onClick={() =>
                showNotice("Você não tem novas notificações.")
              }
              aria-label="Notificações"
              className="relative flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <Bell size={21} />
            </button>

            <Link
              href="/"
              aria-label="Sair"
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <LogOut size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <p className="text-sm font-medium text-sky-700">
            PAINEL DO MOTORISTA
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Seu dia, em movimento.
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Confira seu veículo e acompanhe suas operações.
          </p>
        </div>

        {/* Vehicle card */}
        <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <Truck size={30} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Seu veículo
            </p>
            <p className="mt-1 text-xl font-bold tracking-wide sm:text-2xl">
              {driver.vehiclePlate}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Ativo
          </span>
        </section>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Next shipment */}
          <Link
            href="/motorista/expedicao"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <PackageCheck size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  Próxima carga
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Expedição
                </h3>
              </div>

              <ArrowRight
                size={21}
                className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-700"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Pátio</p>
                <p className="mt-1 font-bold">{driver.yard}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Doca</p>
                <p className="mt-1 font-bold">{driver.dock}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="text-slate-500">
                Consulte os detalhes da carga
              </span>
              <ChevronRight size={18} className="text-sky-700" />
            </div>
          </Link>

          {/* Loading history */}
          <Link
            href="/motorista/historico"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Clock3 size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  Seus carregamentos
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Histórico
                </h3>
              </div>

              <ArrowRight
                size={21}
                className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-700"
              />
            </div>

            <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-100 py-4">
              {statistics.map((stat) => (
                <div
                  key={stat.label}
                  className="px-2 text-center first:pl-0 last:pr-0"
                >
                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Consulte suas entregas anteriores
              </span>
              <ChevronRight size={18} className="text-sky-700" />
            </div>
          </Link>
        </div>

        {/* Informational notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <ShieldCheck className="mt-0.5 shrink-0 text-sky-700" size={21} />
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
      </div>

      {/* Bottom navigation */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-xl grid-cols-3 px-2">
          <Link
            href="/motorista"
            aria-current="page"
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 text-sky-700"
          >
            <House size={22} strokeWidth={2.3} />
            <span className="text-xs font-semibold">Início</span>
          </Link>

          <Link
            href="/motorista/expedicao"
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 text-slate-500 transition hover:text-sky-700"
          >
            <Package size={22} />
            <span className="text-xs">Expedição</span>
          </Link>

          <Link
            href="/motorista/historico"
            className="flex min-h-[68px] flex-col items-center justify-center gap-1 text-slate-500 transition hover:text-sky-700"
          >
            <Clock3 size={22} />
            <span className="text-xs">Histórico</span>
          </Link>
        </div>
      </nav>

      {/* QR Code modal */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setQrOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                FastTrack
              </span>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label="Fechar QR Code"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <h2 id="qr-title" className="mt-4 text-xl font-bold">
              Seu QR Code
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Apresente este código ao porteiro para identificar
              seu perfil.
            </p>

            <div className="mx-auto mt-6 flex w-fit rounded-2xl border border-slate-200 bg-white p-4">
              <QRCodeSVG
                value={driver.id}
                size={192}
                level="H"
                includeMargin
                title="QR Code de identificação do motorista"
              />
            </div>

            <p className="mt-4 font-semibold text-slate-900">
              {driver.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {driver.vehiclePlate}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-900">
              <ShieldCheck size={18} className="shrink-0" />
              <span>
                Código demonstrativo. Na versão final, a identificação
                será validada pelo servidor.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setQrOpen(false)}
              className="mt-5 min-h-12 w-full rounded-xl bg-sky-700 px-4 font-semibold text-white transition hover:bg-sky-800"
            >
              Fechar
            </button>
          </section>
        </div>
      )}

      {/* Temporary feedback */}
      {notice && (
        <div
          role="status"
          className="fixed left-4 right-4 top-4 z-[60] mx-auto flex max-w-md items-center gap-2 rounded-xl bg-slate-900 p-4 text-sm text-white shadow-xl"
        >
          <Check size={18} className="shrink-0 text-emerald-400" />
          {notice}
        </div>
      )}
    </main>
  );
}