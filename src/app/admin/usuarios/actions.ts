"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateUserState = {
  success: boolean;
  message: string;
};

export async function createUser(
  _previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "Você precisa estar autenticado.",
    };
  }

  const currentRole = session.user.role;

  if (currentRole !== "ADMIN" && currentRole !== "SUPERVISOR") {
    return {
      success: false,
      message: "Você não tem permissão para cadastrar usuários.",
    };
  }

  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const roleValue = formData.get("role");

  if (
    typeof nameValue !== "string" ||
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string" ||
    typeof roleValue !== "string"
  ) {
    return {
      success: false,
      message: "Preencha todos os campos corretamente.",
    };
  }

  const name = nameValue.trim();
  const email = emailValue.trim().toLowerCase();
  const password = passwordValue;
  const requestedRole = roleValue as UserRole;

  if (name.length < 2 || name.length > 100) {
    return {
      success: false,
      message: "O nome deve ter entre 2 e 100 caracteres.",
    };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return {
      success: false,
      message: "Informe um e-mail válido.",
    };
  }

  if (password.length < 8 || password.length > 72) {
    return {
      success: false,
      message: "A senha deve ter entre 8 e 72 caracteres.",
    };
  }

  const allowedRoles: UserRole[] =
    currentRole === "ADMIN"
      ? ["ADMIN", "SUPERVISOR", "PORTEIRO"]
      : ["PORTEIRO"];

  if (!allowedRoles.includes(requestedRole)) {
    return {
      success: false,
      message: "Você não tem permissão para criar esse perfil.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Já existe um usuário cadastrado com esse e-mail.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: requestedRole,
      },
    });
  } catch (error) {
    // O tratamento P2002 cobre a possibilidade de dois cadastros
    // simultâneos tentarem usar o mesmo e-mail.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Já existe um usuário cadastrado com esse e-mail.",
      };
    }

    console.error("Erro ao cadastrar usuário:", error);

    return {
      success: false,
      message: "Não foi possível cadastrar o usuário. Tente novamente.",
    };
  }

  revalidatePath("/admin/usuarios");

  redirect("/admin/usuarios?cadastro=sucesso");
}