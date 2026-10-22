"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  QrCode,
  UserRound,
  X,
} from "lucide-react";

interface SupervisorHeaderProps {
  name: string;
  unreadNotifications: number;
}

export function SupervisorHeader({
  name,
  unreadNotifications,
}: SupervisorHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  function handleLogout() {
    const confirmed = window.confirm("Deseja realmente sair da sua conta?");

    if (confirmed) {
      // Ainda não há sessão real para encerrar.
      router.push("/");
    }
  }

  return (
    <header className="relative z-20 rounded-b-[28px] bg-[#253447] px-5 pb-7 pt-4 text-white shadow-lg sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Abrir leitor de QR Code"
            onClick={() => router.push("/supervisor/qr")}
            className="flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
          >
            <QrCode size={22} />
          </button>

          <span className="text-xs font-semibold tracking-[2px] text-slate-300">
            FASTTRACK
          </span>

          <button
            type="button"
            aria-label="Sair da conta"
            onClick={handleLogout}
            className="flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
          >
            <LogOut size={21} />
          </button>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-[#DCEBFA] text-[#24476C]">
            <UserRound size={29} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-300">Bem-vindo,</p>
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {name}
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Supervisor de Estoque
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label={`Notificações, ${unreadNotifications} não lidas`}
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications((value) => !value)}
              className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <Bell size={21} />

              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full border-2 border-[#253447] bg-[#F97066] text-[9px] font-bold text-white">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                role="dialog"
                aria-label="Notificações"
                className="absolute right-0 top-14 z-30 w-[min(300px,calc(100vw-40px))] rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold">Notificações</h2>
                  <button
                    type="button"
                    aria-label="Fechar notificações"
                    onClick={() => setShowNotifications(false)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Você tem {unreadNotifications} notificações não lidas.
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  A lista completa será implementada posteriormente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}