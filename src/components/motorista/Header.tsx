"use client";

import Link from "next/link";
import { Bell, LogOut, QrCode, Truck } from "lucide-react";

interface HeaderProps {
  driverName: string;
  onOpenQr: () => void;
  onNotification: () => void;
}

export function Header({ driverName, onOpenQr, onNotification }: HeaderProps) {
  return (
    <header className="bg-[#0B1424] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600">
            <Truck size={26} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-300">Bem-vindo,</p>
            <h1 className="truncate text-lg font-bold sm:text-xl">
              {driverName}
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Área do motorista
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenQr}
            aria-label="Mostrar meu QR Code"
            className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
          >
            <QrCode size={21} />
          </button>

          <button
            type="button"
            onClick={onNotification}
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
  );
}