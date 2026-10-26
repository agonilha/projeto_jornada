"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Package, Clock3 } from "lucide-react";

const links = [
  {
    label: "Início",
    href: "/motorista",
    Icon: House,
  },
  {
    label: "Expedição",
    href: "/motorista/expedicao",
    Icon: Package,
  },
  {
    label: "Histórico",
    href: "/motorista/historico",
    Icon: Clock3,
  },
];

export default function DriverNavbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-xl grid-cols-3 px-2">
        {links.map(({ label, href, Icon }) => {
          const active =
            href === "/motorista"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-xl transition ${
              active
                  ? "bg-blue-50 font-semibold text-blue-900"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.3 : 1.8}
              />
              <span
                className={`text-xs ${
                  active ? "font-semibold" : "font-normal"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}