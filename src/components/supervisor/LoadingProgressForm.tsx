"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { atualizarCarregamento } from "@/app/supervisor/actions";

type LoadingProgressFormProps = {
  expedicaoId: string;
  progressoAtual: number;
  status: string;
};

const etapas = [
  { valor: 0, nome: "Pedido recebido" },
  { valor: 25, nome: "Em separação" },
  { valor: 50, nome: "Aguardando transporte" },
  { valor: 75, nome: "Enviada à doca" },
  { valor: 100, nome: "Aguardando motorista" },
];

export default function LoadingProgressForm({
  expedicaoId,
  progressoAtual,
  status,
}: LoadingProgressFormProps) {
  const router = useRouter();

  const [progresso, setProgresso] = useState(progressoAtual);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const encerrada =
    status === "FINALIZADA" || status === "CANCELADA";

  const etapaAtual = etapas.find(
    (etapa) => etapa.valor === progresso
  );

  function selecionarEtapa(valor: number) {
    if (encerrada || salvando) return;
    setProgresso(valor);
    setMensagem("");
  }

  async function salvarProgresso() {
    setMensagem("");
    setSucesso(false);
    setSalvando(true);

    try {
      const resultado = await atualizarCarregamento(
        expedicaoId,
        progresso
      );

      setMensagem(resultado.message);
      setSucesso(resultado.success);

      if (resultado.success) {
        router.refresh();
      }
    } catch {
      setMensagem("Não foi possível salvar o progresso.");
      setSucesso(false);
    } finally {
      setSalvando(false);
    }
  }

  function corCirculo(valor: number) {
    if (valor === progresso) {
      return "border-sky-900 bg-sky-900";
    }

    if (valor < progresso) {
      return "border-sky-600 bg-sky-600";
    }

    return "border-slate-300 bg-slate-300";
  }

  return (
    <div className="mt-5 min-w-0 space-y-5 border-t border-slate-100 pt-5">
      <h4 className="text-sm font-semibold text-slate-800">
        Etapas do carregamento
      </h4>

      {/* Versão para celular */}
      <div className="space-y-0 sm:hidden">
        {etapas.map((etapa, index) => {
          const selecionada = etapa.valor === progresso;

          return (
            <button
              key={etapa.valor}
              type="button"
              onClick={() => selecionarEtapa(etapa.valor)}
              disabled={encerrada || salvando}
              aria-pressed={selecionada}
              className="flex w-full items-stretch gap-4 text-left disabled:cursor-not-allowed"
            >
              <div className="relative flex w-7 shrink-0 justify-center">
                {index < etapas.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 top-7 w-0.5 -translate-x-1/2 bg-slate-300" />
                )}

                <span
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${corCirculo(etapa.valor)}`}
                >
                  {selecionada && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
              </div>

              <div
                className={`mb-3 min-w-0 flex-1 rounded-xl border px-4 py-3 ${
                  selecionada
                    ? "border-sky-300 bg-sky-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-semibold text-sky-700">
                  {etapa.valor}%
                </p>

                <p
                  className={`mt-1 text-sm ${
                    selecionada
                      ? "font-bold text-sky-950"
                      : "font-medium text-slate-700"
                  }`}
                >
                  {etapa.nome}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Versão para tablet e computador */}
      <div className="hidden w-full sm:grid sm:grid-cols-5">
        {etapas.map((etapa, index) => {
          const selecionada = etapa.valor === progresso;
      
          return (
            <button
              key={etapa.valor}
              type="button"
              onClick={() => selecionarEtapa(etapa.valor)}
              disabled={encerrada || salvando}
              aria-pressed={selecionada}
              className="group flex min-w-0 flex-col items-center text-center disabled:cursor-not-allowed"
            >
              <span className="mb-3 text-sm font-bold text-slate-800">
                {etapa.valor}%
              </span>
          
              <div className="relative flex h-7 w-full items-center justify-center">
                {/* Conexão com a etapa anterior */}
                {index > 0 && (
                  <div className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-slate-300" />
                )}
      
                {/* Conexão com a próxima etapa */}
                {index < etapas.length - 1 && (
                  <div className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-300" />
                )}
      
                <span
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-110 ${corCirculo(etapa.valor)}`}
                >
                  {selecionada && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
              </div>
              
              <span
                className={`mt-3 max-w-28 px-1 text-xs leading-snug ${
                  selecionada
                    ? "font-bold text-sky-900"
                    : "text-slate-600"
                }`}
              >
                {etapa.nome}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-sky-50 p-4">
        <p className="text-xs font-medium text-sky-700">
          Etapa selecionada
        </p>

        <p className="mt-1 font-bold text-sky-950">
          {etapaAtual?.nome ?? "Não identificada"} — {progresso}%
        </p>
      </div>

      {!encerrada ? (
        <button
          type="button"
          onClick={salvarProgresso}
          disabled={salvando || progresso === progressoAtual}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {salvando ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Salvando...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Salvar etapa
            </>
          )}
        </button>
      ) : (
        <p className="text-sm text-slate-500">
          Esta expedição está encerrada e não pode ser editada.
        </p>
      )}

      {mensagem && (
        <p
          role="status"
          className={`text-sm ${
            sucesso ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
}