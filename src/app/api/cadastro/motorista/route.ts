import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const cpf =
      typeof body.cpf === "string"
        ? body.cpf.replace(/\D/g, "")
        : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !cpf || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    if (cpf.length !== 11) {
      return NextResponse.json(
        { error: "O CPF deve conter 11 dígitos." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const existingDriver = await prisma.driverProfile.findUnique({
      where: { cpf },
    });

    if (existingDriver) {
      return NextResponse.json(
        { error: "Este CPF já está cadastrado." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MOTORISTA",
        driverProfile: {
          create: {
            cpf,
            phone: phone || null,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Cadastro realizado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar motorista:", error);

    return NextResponse.json(
      { error: "Não foi possível realizar o cadastro. Tente novamente." },
      { status: 500 }
    );
  }
}