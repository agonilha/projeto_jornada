import Link from "next/link";
import { Clock3, House, Package } from "lucide-react";

interface BottomNavProps {
  currentPath?: string;
}

export function BottomNav({ currentPath = "/motorista" }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-xl grid-cols-3 px-2">
        <Link
          href="/motorista"
          aria-current={currentPath === "/motorista" ? "page" : undefined}
          className={`flex min-h-[68px] flex-col items-center justify-center gap-1 transition ${
            currentPath === "/motorista"
              ? "text-sky-700 font-semibold"
              : "text-slate-500 hover:text-sky-700"
          }`}
        >
          <House size={22} strokeWidth={currentPath === "/motorista" ? 2.3 : 2} />
          <span className="text-xs">Início</span>
        </Link>

        <Link
          href="/motorista/expedicao"
          aria-current={currentPath === "/motorista/expedicao" ? "page" : undefined}
          className={`flex min-h-[68px] flex-col items-center justify-center gap-1 transition ${
            currentPath === "/motorista/expedicao"
              ? "text-sky-700 font-semibold"
              : "text-slate-500 hover:text-sky-700"
          }`}
        >
          <Package size={22} />
          <span className="text-xs">Expedição</span>
        </Link>

        <Link
          href="/motorista/historico"
          aria-current={currentPath === "/motorista/historico" ? "page" : undefined}
          className={`flex min-h-[68px] flex-col items-center justify-center gap-1 transition ${
            currentPath === "/motorista/historico"
              ? "text-sky-700 font-semibold"
              : "text-slate-500 hover:text-sky-700"
          }`}
        >
          <Clock3 size={22} />
          <span className="text-xs">Histórico</span>
        </Link>
      </div>
    </nav>
  );
}