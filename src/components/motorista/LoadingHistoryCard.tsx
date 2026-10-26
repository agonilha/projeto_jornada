import Link from "next/link";
import { ArrowRight, ChevronRight, Clock3 } from "lucide-react";

type LoadingHistoryCardProps = {
  total: number;
  thisMonth: number;
  today: number;
};

export default function LoadingHistoryCard({
  total,
  thisMonth,
  today,
}: LoadingHistoryCardProps) {
  const statistics = [
    { label: "Total", value: total },
    { label: "Este mês", value: thisMonth },
    { label: "Hoje", value: today },
  ];

  return (
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
          <h3 className="mt-1 text-xl text-slate-700 font-bold">Histórico</h3>
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
            <p className="text-2xl font-bold text-slate-700 tracking-tight sm:text-3xl">
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
  );
}