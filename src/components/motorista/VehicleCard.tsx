import { Truck } from "lucide-react";

type VehicleCardProps = {
  plate: string;
  status: string;
};

export default function VehicleCard({
  plate,
  status,
}: VehicleCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
        <Truck size={30} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Seu veículo
        </p>
        <p className="mt-1 text-xl font-bold tracking-wide text-slate-700 sm:text-2xl">
          {plate}
        </p>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        {status}
      </span>
    </section>
  );
}