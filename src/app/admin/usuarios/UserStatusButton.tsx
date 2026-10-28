"use client";

import { useState, useTransition } from "react";
import { toggleUserStatus } from "./actions";

type UserStatusButtonProps = {
  userId: string;
  userName: string;
  isActive: boolean;
  isCurrentUser: boolean;
};

export default function UserStatusButton({
  userId,
  userName,
  isActive,
  isCurrentUser,
}: UserStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleToggle() {
    const action = isActive ? "desativar" : "ativar";

    const confirmed = window.confirm(
      `Deseja realmente ${action} o usuário "${userName}"?`,
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      try {
        await toggleUserStatus(userId);
      } catch {
        setError("Não foi possível alterar o status do usuário.");
      }
    });
  }

  return (
    <div className="flex min-w-[130px] flex-col items-start gap-2">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          isActive
            ? "bg-emerald-100 text-emerald-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Ativo" : "Inativo"}
      </span>

      {isCurrentUser ? (
        <span className="text-xs text-slate-500">Sua conta</span>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isActive
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
          }`}
        >
          {isPending
            ? "Salvando..."
            : isActive
              ? "Desativar"
              : "Ativar"}
        </button>
      )}

      {error && (
        <p role="alert" className="max-w-[180px] text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}