"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import {
  Bell,
  LogOut,
  QrCode,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

type DadosQRCode = {
  name: string;
  plate: string | null;
  qrCode: string;
  expiresAt: string;
};

export default function DriverHeader() {
  const [qrOpen, setQrOpen] = useState(false);
  const [dados, setDados] = useState<DadosQRCode | null>(null);
  const [nome, setNome] = useState("Motorista");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const buscarQRCode = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("/api/motorista/qr-code", {
        cache: "no-store",
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error || "Não foi possível gerar o QR Code."
        );
      }

      setDados(resultado);
      setNome(resultado.name);
    } catch (error) {
      setDados(null);
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar o QR Code."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // Atualiza o nome do motorista ao carregar a página.
    void buscarQRCode();
  }, [buscarQRCode]);

  useEffect(() => {
    if (!qrOpen) return;

    // Renova o QR Code antes do vencimento de 5 minutos.
    const intervalo = setInterval(() => {
      void buscarQRCode();
    }, 4 * 60 * 1000);

    return () => clearInterval(intervalo);
  }, [qrOpen, buscarQRCode]);

  function abrirQRCode() {
    setQrOpen(true);
    void buscarQRCode();
  }

  return (
    <>
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
                {nome}
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Área do motorista
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={abrirQRCode}
              aria-label="Mostrar meu QR Code"
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <QrCode size={21} />
            </button>

            <button
              type="button"
              aria-label="Notificações"
              onClick={() =>
                alert("Notificações serão implementadas posteriormente.")
              }
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <Bell size={21} />
            </button>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Sair"
              className="flex size-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 sm:size-11"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {qrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setQrOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center text-slate-900 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                Jornada
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

            <p className="mt-2 text-sm text-slate-500">
              Apresente este código ao porteiro para identificar seu perfil.
            </p>

            <div className="mx-auto mt-6 flex min-h-56 min-w-56 items-center justify-center rounded-2xl border border-slate-200 p-4">
              {carregando ? (
                <p className="text-sm text-slate-500">
                  Gerando QR Code...
                </p>
              ) : dados ? (
                <QRCodeSVG
                  value={dados.qrCode}
                  size={192}
                  level="H"
                  includeMargin
                />
              ) : (
                <p className="text-sm text-slate-500">
                  QR Code indisponível
                </p>
              )}
            </div>

            {erro && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {erro}
              </p>
            )}

            {dados && !carregando && (
              <>
                <p className="mt-4 font-semibold">{dados.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {dados.plate ?? "Nenhum veículo cadastrado"}
                </p>
              </>
            )}

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-left text-xs text-sky-900">
              <ShieldCheck size={18} className="shrink-0" />
              <span>
                Código temporário com validade de 5 minutos.
                Apresente-o na portaria para identificação.
              </span>
            </div>

            <button
              type="button"
              onClick={() => void buscarQRCode()}
              disabled={carregando}
              className="mt-5 min-h-12 w-full rounded-xl bg-sky-700 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
            >
              Atualizar QR Code
            </button>

            <button
              type="button"
              onClick={() => setQrOpen(false)}
              className="mt-3 min-h-12 w-full rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </>
  );
}