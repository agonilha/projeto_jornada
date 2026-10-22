import { Truck } from "lucide-react";
import type { VehicleStatus } from "@/features/supervisor/supervisor-service";

interface VehicleCardProps {
  plate: string;
  status: VehicleStatus;
}

const statusStyles: Record<VehicleStatus, string> = {
  Ativo: "bg-emerald-100 text-emerald-800",
  Inativo: "bg-slate-100 text-slate-600",
  Bloqueado: "bg-red-100 text-red-800",
};

export function VehicleCard({ plate, status }: VehicleCardProps) {
  return (
    <section
      aria-label="Informações do veículo"
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Truck size={25} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">
          Placa do veículo
        </p>
        <p className="mt-1 text-lg font-bold tracking-wide text-slate-800">
          {plate}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status]}`}
      >
        {status}
      </span>
    </section>
  );
}