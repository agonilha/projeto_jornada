"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshExpedicao() {
  const router = useRouter();

  useEffect(() => {
    function atualizar() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }

    const intervalo = setInterval(atualizar, 10000);

    document.addEventListener("visibilitychange", atualizar);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", atualizar);
    };
  }, [router]);

  return null;
}