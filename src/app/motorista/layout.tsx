import type { ReactNode } from "react";
import DriverHeader from "@/components/motorista/DriverHeader";
import DriverNavbar from "@/components/motorista/DriverNavbar";

export default function DriverLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <DriverHeader />
      <div className="min-h-dvh bg-slate-50 pb-28">
        {children}
      </div>
      <DriverNavbar />
    </>
  );
}