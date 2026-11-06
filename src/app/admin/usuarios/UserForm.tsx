"use client";

import { useActionState, useState } from "react";
import { createUser, type CreateUserState } from "./actions";

const initialState: CreateUserState = {
  success: false,
  message: "",
};

type UserFormProps = {
  isAdmin: boolean;
};

const inputClassName =
  "w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-700 placeholder:opacity-100 shadow-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-200";

export default function UserForm({ isAdmin }: UserFormProps) {
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Nome completo
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          placeholder="Digite o nome completo"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="usuario@empresa.com"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Perfil de acesso
        </label>

        <select
          id="role"
          name="role"
          required
          value={perfilSelecionado}
          onChange={(event) => setPerfilSelecionado(event.target.value)}
          className={`${inputClassName} cursor-pointer`}
        >
          <option value="" disabled>
            Selecione um perfil
          </option>

          {isAdmin && <option value="ADMIN">Administrador</option>}

          {isAdmin && (
            <option value="SUPERVISOR">Supervisor</option>
          )}

          <option value="PORTEIRO">Porteiro</option>

          {isAdmin && (
            <option value="MOTORISTA">Motorista</option>
          )}
        </select>
      </div>

      {perfilSelecionado === "MOTORISTA" && (
        <div className="space-y-5 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div>
            <h3 className="font-semibold text-sky-950">
              Dados do motorista
            </h3>

            <p className="mt-1 text-sm text-sky-800">
              Informações necessárias para criar o perfil do motorista.
            </p>
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              CPF
            </label>

            <input
              id="cpf"
              name="cpf"
              type="text"
              required
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Telefone (opcional)
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={20}
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              className={inputClassName}
            />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Senha inicial
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          className={inputClassName}
        />

        <p className="mt-2 text-sm text-slate-700">
          A senha será armazenada com hash no banco de dados.
        </p>
      </div>

      {state.message && (
        <div
          role={state.success ? "status" : "alert"}
          aria-live="polite"
          className={`rounded-xl border p-4 text-sm font-medium ${
            state.success
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-sky-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Cadastrando..." : "Cadastrar usuário"}
      </button>
    </form>
  );
}