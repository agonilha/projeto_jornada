type ShipmentProgressProps = {
  progress: number;
};

const etapas = [
  { valor: 0, nome: "Pedido recebido" },
  { valor: 25, nome: "Em separação" },
  { valor: 50, nome: "Aguardando transporte" },
  { valor: 75, nome: "Enviada à doca" },
  { valor: 100, nome: "Aguardando motorista" },
];

export default function ShipmentProgress({
  progress,
}: ShipmentProgressProps) {
  const etapaAtual =
    etapas.find((etapa) => etapa.valor === progress) ??
    etapas[0];

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-800">
        Acompanhamento da carga
      </h2>

      {/* Visualização mobile */}
      <div className="mt-6 space-y-0 sm:hidden">
        {etapas.map((etapa, index) => {
          const atual = etapa.valor === etapaAtual.valor;
          const concluida = etapa.valor < etapaAtual.valor;

          return (
            <div key={etapa.valor} className="flex gap-4">
              <div className="relative flex w-7 shrink-0 justify-center">
                {index < etapas.length - 1 && (
                  <div className="absolute bottom-0 top-7 left-1/2 w-0.5 -translate-x-1/2 bg-slate-300" />
                )}

                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                    atual
                      ? "bg-sky-900"
                      : concluida
                        ? "bg-sky-600"
                        : "bg-slate-300"
                  }`}
                >
                  {atual && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
              </div>

              <div
                className={`mb-3 min-w-0 flex-1 rounded-xl border p-3 ${
                  atual
                    ? "border-sky-300 bg-sky-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-bold text-sky-700">
                  {etapa.valor}%
                </p>
                <p
                  className={`mt-1 text-sm ${
                    atual
                      ? "font-bold text-sky-950"
                      : "text-slate-600"
                  }`}
                >
                  {etapa.nome}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualização desktop */}
      <div className="mt-6 hidden w-full sm:grid sm:grid-cols-5">
        {etapas.map((etapa, index) => {
          const atual = etapa.valor === etapaAtual.valor;
          const concluida = etapa.valor < etapaAtual.valor;

          return (
            <div
              key={etapa.valor}
              className="flex min-w-0 flex-col items-center text-center"
            >
              <span className="mb-3 text-sm font-bold text-slate-800">
                {etapa.valor}%
              </span>

              <div className="relative flex h-7 w-full items-center justify-center">
                {index > 0 && (
                  <div className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-slate-300" />
                )}

                {index < etapas.length - 1 && (
                  <div className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-300" />
                )}

                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                    atual
                      ? "bg-sky-900"
                      : concluida
                        ? "bg-sky-600"
                        : "bg-slate-300"
                  }`}
                >
                  {atual && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
              </div>

              <span
                className={`mt-3 px-1 text-xs leading-snug ${
                  atual
                    ? "font-bold text-sky-900"
                    : "text-slate-600"
                }`}
              >
                {etapa.nome}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-sky-50 p-4">
        <p className="text-xs font-medium text-sky-700">
          Situação atual
        </p>

        <p className="mt-1 font-bold text-sky-950">
          {etapaAtual.nome} — {etapaAtual.valor}%
        </p>
      </div>
    </section>
  );
}