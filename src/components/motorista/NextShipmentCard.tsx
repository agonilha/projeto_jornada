import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  PackageCheck,
} from "lucide-react";

type NextShipmentCardProps = {
  yard: string;
  dock: string;
};

export default function NextShipmentCard({
  yard,
  dock,
}: NextShipmentCardProps) {
  return (
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
          <h3 className="mt-1 text-xl text-slate-700 font-bold">Expedição</h3>
        </div>

        <ArrowRight
          size={21}
          className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-700"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Pátio</p>
          <p className="mt-1 font-bold text-slate-700">{yard}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Doca</p>
          <p className="mt-1 font-bold text-slate-700">{dock}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-500">
          Consulte os detalhes da carga
        </span>
        <ChevronRight size={18} className="text-sky-700" />
      </div>
    </Link>
  );
}