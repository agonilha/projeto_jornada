"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  UserRound,
  Mail,
  Phone,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

import CadastroLayout from "@/components/cadastro/CadastroLayout";
import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import FormButton from "@/components/forms/FormButton";

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
    <CadastroLayout
      titulo="Cadastro de motorista"
      descricao="Crie sua conta para acompanhar suas expedições, consultar carregamentos e agilizar sua entrada na portaria."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Os campos do formulário serão reorganizados no próximo passo. */}
        <p className="text-sm text-slate-600">
          Estamos preparando seu formulário de cadastro.
        </p>
      </form>
    </CadastroLayout>
  );
}