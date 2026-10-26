"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ScanFace,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";



export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setMessage("");

  const email = identifier.trim().toLowerCase();

  if (!email || !password) {
    setMessage("Preencha o e-mail e a senha.");
    return;
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setMessage("E-mail ou senha inválidos.");
      return;
    }

    const response = await fetch("/api/auth/session");
    const session = await response.json();

    switch (session?.user?.role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "PORTEIRO":
        router.push("/porteiro");
        break;

      case "MOTORISTA":
        router.push("/motorista");
        break;

      case "SUPERVISOR":
        router.push("/supervisor");
        break;

      default:
        setMessage(
          "Não foi possível identificar o perfil do usuário."
        );
    }
  } catch {
    setMessage(
      "Não foi possível realizar o login. Tente novamente."
    );
  }
};

  function handleBiometrics() {
    setMessage("A autenticação biométrica será configurada posteriormente.");
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0B1424] px-4 py-8 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 -z-0 size-96 rounded-full bg-sky-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 -z-0 size-96 rounded-full bg-blue-800/20 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Brand */}
        <header className="mb-7 flex flex-col items-center text-center text-white">
          <div className="mb-3.5 flex size-[72px] items-center justify-center rounded-[22px] border border-white/15 bg-gradient-to-br from-sky-500 to-sky-800 shadow-xl shadow-sky-950/40">
            <Truck size={36} strokeWidth={1.8} />
          </div>

          <h1 className="text-[29px] font-bold tracking-tight">
            FastTrack
          </h1>

          <p className="mt-1 text-sm text-slate-300">
            Pátio Inteligente
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] tracking-wide text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400" />
            Gestão logística simplificada
          </div>
        </header>

        {/* Login card */}
        <section className="rounded-3xl border border-white/60 bg-white p-6 shadow-2xl shadow-black/25 sm:p-8">
          <div className="mb-7">
            <span className="text-[10px] font-bold tracking-[1.5px] text-sky-700">
              ACESSO À PLATAFORMA
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Bem-vindo de volta
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Entre para acompanhar suas operações.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Identifier */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="identifier"
                className="text-[13px] font-semibold text-slate-700"
              >
                E-mail
              </label>

              <div className="flex h-[50px] items-center gap-3 rounded-xl border border-slate-300 px-3.5 text-slate-500 transition focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-600/10">
                <UserRound size={19} />

                <input
                  id="identifier"
                  type="email"
                  autoComplete="username"
                  placeholder="Digite seu e-mail"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[13px] font-semibold text-slate-700"
              >
                Senha
              </label>

              <div className="flex h-[50px] items-center gap-3 rounded-xl border border-slate-300 px-3.5 text-slate-500 transition focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-600/10">
                <LockKeyhole size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="rounded-md p-1 transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-sky-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="-mt-2 flex justify-end">
              <Link
                href="/recuperar-senha"
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 active:scale-[0.99]"
            >
              Entrar na plataforma
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Biometric alternative */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold tracking-wider text-slate-400">
              OU ACESSE COM
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleBiometrics}
            className="flex min-h-[76px] w-full items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-left transition hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
              <ScanFace size={27} />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xs font-bold text-sky-950">
                Autenticação biométrica
              </span>
              <span className="text-[10px] leading-relaxed text-slate-600">
                Use a autenticação segura do seu dispositivo
              </span>
            </span>

            <ArrowRight size={18} className="shrink-0 text-sky-700" />
          </button>

          {message && (
            <p
              role="status"
              className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"
            >
              {message}
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-1.5 text-xs">
            <span className="text-slate-500">Não tem uma conta?</span>
            <Link
              href="/cadastro"
              className="font-semibold text-sky-700 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[11px] text-slate-400">
            <ShieldCheck size={16} />
            <span>Seu acesso merece segurança.</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400">
          <span className="font-bold tracking-[1.4px]">FASTTRACK</span>
          <span className="text-sky-500">•</span>
          <span>Gestão inteligente de pátios</span>
        </footer>
      </div>
    </main>
  );
}
