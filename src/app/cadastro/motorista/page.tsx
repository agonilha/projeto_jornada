"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  UserRound,
  Mail,
  Phone,
  CreditCard,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function CadastroMotoristaPage() {
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (formData.password.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    alert("A interface está pronta. Na próxima etapa, conectaremos o cadastro ao banco de dados.");
  }

  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-200";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          Voltar ao login
        </Link>

        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <header className="bg-slate-900 px-6 py-8 text-white sm:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500">
                <Truck size={26} />
              </div>

              <div>
                <p className="text-sm font-medium text-sky-300">
                  FastTrack
                </p>
                <h1 className="text-2xl font-bold">
                  Cadastro de motorista
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
              Crie sua conta para acompanhar suas expedições, consultar
              carregamentos e agilizar sua entrada na portaria.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Seus dados
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Preencha as informações para criar sua conta.
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Nome completo
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClassName} pl-11`}
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClassName} pl-11`}
                  maxLength={254}
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cpf"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  CPF
                </label>

                <div className="relative">
                  <CreditCard
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    className={`${inputClassName} pl-11`}
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Telefone
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputClassName} pl-11`}
                    maxLength={20}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900">
                Crie sua senha
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Use pelo menos 8 caracteres.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  name="password"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Crie uma senha segura"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClassName} px-11`}
                  minLength={8}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={mostrarConfirmacao ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClassName} px-11`}
                  minLength={8}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmacao(!mostrarConfirmacao)
                  }
                  aria-label={
                    mostrarConfirmacao
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {mostrarConfirmacao ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-sky-50 p-4">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-sky-700"
              />
              <p className="text-sm leading-5 text-sky-900">
                Sua conta será criada com o perfil de motorista. Seus dados
                serão utilizados para identificação e gerenciamento das
                expedições no FastTrack.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-sky-600 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              Criar minha conta
            </button>

            <p className="text-center text-sm text-slate-600">
              Já possui uma conta?{" "}
              <Link
                href="/"
                className="font-bold text-sky-700 hover:text-sky-900"
              >
                Entrar no FastTrack
              </Link>
            </p>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          FastTrack · Gestão inteligente de expedições
        </p>
      </div>
    </main>
  );
}