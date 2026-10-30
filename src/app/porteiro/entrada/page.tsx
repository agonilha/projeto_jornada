"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, CheckCircle2, ScanLine } from "lucide-react";

type Resultado = {
  motorista: {
    id: string;
    name: string;
  };
  veiculos: {
    id: string;
    plate: string;
  }[];
  expedicao: null | {
    id: string;
    description: string;
    status: string;
    scheduledAt: string;
    yard: {
      id: string;
      name: string;
    };
    vehicle: {
      id: string;
      plate: string;
    };
  };
};

function LeitorQRCode({
  onLeitura,
}: {
  onLeitura: (codigo: string) => void;
}) {
  const onLeituraRef = useRef(onLeitura);

  useEffect(() => {
    onLeituraRef.current = onLeitura;
  }, [onLeitura]);

  useEffect(() => {
    let cancelado = false;
    let scanner: import("html5-qrcode").Html5QrcodeScanner | null =
      null;
    let lido = false;

    async function iniciar() {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      if (cancelado) return;

      scanner = new Html5QrcodeScanner(
        "leitor-qr-porteiro",
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          rememberLastUsedCamera: false,
        },
        false
      );

      scanner.render((texto) => {
        if (lido || cancelado) return;

        lido = true;
        onLeituraRef.current(texto);
      });
    }

    void iniciar().catch(console.error);

    return () => {
      cancelado = true;

      if (scanner) {
        void scanner.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <div
      id="leitor-qr-porteiro"
      className="overflow-hidden rounded-xl"
    />
  );
}

export default function RegistrarEntradaPage() {
  const [codigo, setCodigo] = useState("");
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function validarCodigo(valor: string) {
    setCameraAtiva(false);
    setCarregando(true);
    setErro("");
    setResultado(null);
    setCodigo(valor);

    try {
      const response = await fetch("/api/porteiro/validar-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode: valor.trim() }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(
          dados.error ?? "Não foi possível validar o código."
        );
      }

      setResultado(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao validar QR Code."
      );
    } finally {
      setCarregando(false);
    }
  }

  function novaLeitura() {
    setCodigo("");
    setResultado(null);
    setErro("");
    setCameraAtiva(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/porteiro"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          Voltar ao painel
        </Link>

        <header className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-sm text-sky-300">Jornada • Portaria</p>
          <h1 className="mt-2 text-2xl font-bold">
            Registrar entrada
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Leia o QR Code para identificar o motorista e
            consultar seu pátio de destino.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <ScanLine size={22} />
            Identificação do motorista
          </h2>

          {!cameraAtiva && (
            <button
              type="button"
              onClick={() => {
                setResultado(null);
                setErro("");
                setCameraAtiva(true);
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800"
            >
              <Camera size={20} />
              Abrir leitor de QR Code
            </button>
          )}

          {cameraAtiva && (
            <div className="mt-5 space-y-3">
              <LeitorQRCode onLeitura={validarCodigo} />

              <button
                type="button"
                onClick={() => setCameraAtiva(false)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700"
              >
                Fechar câmera
              </button>
            </div>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500">
              Ou informe o código manualmente
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void validarCodigo(codigo);
            }}
            className="space-y-3"
          >
            <textarea
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
              placeholder="Cole o conteúdo do QR Code"
              rows={3}
              maxLength={2048}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 outline-none focus:border-sky-600"
            />

            <button
              type="submit"
              disabled={!codigo.trim() || carregando}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {carregando ? "Validando..." : "Validar código"}
            </button>
          </form>

          {erro && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {erro}
            </p>
          )}
        </section>

        {resultado && (
          <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={22} />
              <h2 className="font-bold">
                Motorista identificado
              </h2>
            </div>

            <div>
              <p className="text-xs text-slate-500">Motorista</p>
              <p className="text-xl font-bold text-slate-800">
                {resultado.motorista.name}
              </p>
            </div>

            {resultado.expedicao ? (
              <>
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
                  <p className="text-sm font-semibold text-sky-700">
                    PÁTIO DE DESTINO
                  </p>
                  <p className="mt-2 text-3xl font-bold text-sky-950">
                    {resultado.expedicao.yard.name}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">
                      Placa
                    </p>
                    <p className="font-bold text-slate-800">
                      {resultado.expedicao.vehicle.plate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Status da expedição
                    </p>
                    <p className="font-bold text-slate-800">
                      {resultado.expedicao.status.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  {resultado.expedicao.description}
                </p>

                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  Entrada ainda não registrada. O porteiro deverá
                  confirmar a chegada do veículo na próxima etapa.
                </p>
              </>
            ) : (
              <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                Este motorista não possui expedição ativa.
                A entrada não pode ser confirmada.
              </p>
            )}

            <button
              type="button"
              onClick={novaLeitura}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
            >
              Nova leitura
            </button>
          </section>
        )}
      </div>
    </main>
  );
}