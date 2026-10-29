"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

interface FormButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export default function FormButton({
  children,
  loading = false,
  disabled,
  className = "",
  type = "submit",
  ...props
}: FormButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading && (
        <LoaderCircle
          size={18}
          className="animate-spin"
          aria-hidden="true"
        />
      )}

      {loading ? "Processando..." : children}
    </button>
  );
}