"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";

import CadastroLayout from "@/components/cadastro/CadastroLayout";
import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import FormButton from "@/components/forms/FormButton";

export default function CadastroMotoristaPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (formData.password !== formData.confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (formData.password.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch("/api/cadastro/motorista", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Não foi possível realizar o cadastro.");
        return;
      }

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      router.push("/");
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <CadastroLayout
      titulo="Cadastro de motorista"
      descricao="Crie sua conta para acompanhar suas expedições, consultar carregamentos e agilizar sua entrada na portaria."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Nome completo"
          name="name"
          placeholder="Digite seu nome completo"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="E-mail"
          name="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="CPF"
            name="cpf"
            placeholder="Somente números ou com pontuação"
            autoComplete="off"
            value={formData.cpf}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Telefone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <PasswordInput
          label="Senha"
          name="password"
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />

        <PasswordInput
          label="Confirmar senha"
          name="confirmPassword"
          placeholder="Digite a senha novamente"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          minLength={8}
          required
        />

        {erro && (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          >
            {erro}
          </p>
        )}

        <FormButton type="submit" loading={carregando}>
          Criar minha conta
        </FormButton>

        <p className="text-center text-sm text-slate-600">
          Já possui uma conta?{" "}
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </CadastroLayout>
  );
}