"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

type ResultadoAtualizacao = {
  success: boolean;
  message: string;
};

export async function atualizarCarregamento(
  expedicaoId: string,
  progresso: number
): Promise<ResultadoAtualizacao> {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.email ||
    !["SUPERVISOR", "ADMIN"].includes(session.user.role)
  ) {
    return {
      success: false,
      message: "Você não possui permissão para esta operação.",
    };
  }

  const usuario = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (
    !usuario ||
    !usuario.isActive ||
    !["SUPERVISOR", "ADMIN"].includes(usuario.role)
  ) {
    return {
      success: false,
      message: "Usuário não autorizado.",
    };
  }

  if (
    !Number.isInteger(progresso) ||
    progresso < 0 ||
    progresso > 100 ||
    progresso % 25 != 0
  ) {
    return {
      success: false,
      message: "O progresso deve ser 0%, 25%, 50%, 75% ou 100%.",
    };
  }

  const expedicao = await prisma.shipment.findUnique({
    where: {
      id: expedicaoId,
    },
  });

  if (!expedicao) {
    return {
      success: false,
      message: "Expedição não encontrada.",
    };
  }

  if (
    expedicao.status === "FINALIZADA" ||
    expedicao.status === "CANCELADA"
  ) {
    return {
      success: false,
      message: "Esta expedição não pode mais ser alterada.",
    };
  }

  try {
    const resultado = await prisma.shipment.updateMany({
      where: {
        id: expedicaoId,
        status: {
          notIn: ["FINALIZADA", "CANCELADA"],
        },
      },
      data: {
      loadingProgress: progresso,
      status:
          progresso === 0
          ? "PEDIDO_RECEBIDO"
          : progresso === 25
              ? "EM_SEPARACAO"
              : "EM_CARREGAMENTO",
      },
    });

    if (resultado.count === 0) {
      return {
        success: false,
        message: "A expedição foi alterada. Atualize a página.",
      };
    }

    revalidatePath("/supervisor");
    revalidatePath("/motorista");
    revalidatePath("/motorista/expedicao");

    return {
      success: true,
      message: "Progresso atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar carregamento:", error);

    return {
      success: false,
      message: "Não foi possível atualizar o carregamento.",
    };
  }
}