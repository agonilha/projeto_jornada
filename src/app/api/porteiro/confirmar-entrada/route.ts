import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      !["PORTEIRO", "ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    const qrCode = body?.qrCode;
    const shipmentId = body?.shipmentId;

    if (
      typeof qrCode !== "string" ||
      qrCode.length > 2048 ||
      typeof shipmentId !== "string" ||
      !shipmentId
    ) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos." },
        { status: 400 }
      );
    }

    const partes = qrCode.split(".");

    if (partes.length !== 2) {
      return NextResponse.json(
        { error: "QR Code inválido." },
        { status: 400 }
      );
    }

    const [payload, assinatura] = partes;
    const secret = process.env.NEXTAUTH_SECRET;

    if (!secret) {
      throw new Error("NEXTAUTH_SECRET não configurado.");
    }

    const assinaturaEsperada = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const recebida = Buffer.from(assinatura);
    const esperada = Buffer.from(assinaturaEsperada);

    if (
      recebida.length !== esperada.length ||
      !timingSafeEqual(recebida, esperada)
    ) {
      return NextResponse.json(
        { error: "Assinatura do QR Code inválida." },
        { status: 401 }
      );
    }

    let conteudo: unknown;

    try {
      conteudo = JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8")
      );
    } catch {
      return NextResponse.json(
        { error: "Conteúdo do QR Code inválido." },
        { status: 400 }
      );
    }

    if (
      typeof conteudo !== "object" ||
      conteudo === null ||
      !("sub" in conteudo) ||
      !("exp" in conteudo) ||
      typeof conteudo.sub !== "string" ||
      typeof conteudo.exp !== "number" ||
      !Number.isSafeInteger(conteudo.exp) ||
      conteudo.exp <= Math.floor(Date.now() / 1000)
    ) {
      return NextResponse.json(
        { error: "QR Code inválido ou expirado. Solicite outro." },
        { status: 401 }
      );
    }

    const porteiro = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (
      !porteiro ||
      !porteiro.isActive ||
      !["PORTEIRO", "ADMIN"].includes(porteiro.role)
    ) {
      return NextResponse.json(
        { error: "Porteiro não autorizado." },
        { status: 403 }
      );
    }

    const motorista = await prisma.user.findUnique({
      where: { id: conteudo.sub },
      include: { driverProfile: true },
    });

    if (
      !motorista ||
      !motorista.isActive ||
      motorista.role !== "MOTORISTA" ||
      !motorista.driverProfile
    ) {
      return NextResponse.json(
        { error: "Motorista não encontrado ou inativo." },
        { status: 404 }
      );
    }

    const expedicao = await prisma.shipment.findFirst({
      where: {
        id: shipmentId,
        driverId: motorista.id,
        status: {
          notIn: ["FINALIZADA", "CANCELADA"],
        },
      },
      include: {
        vehicle: true,
        yard: true,
      },
    });

    if (!expedicao) {
      return NextResponse.json(
        { error: "Expedição não encontrada ou indisponível." },
        { status: 404 }
      );
    }

    if (
      expedicao.vehicle.driverProfileId !==
      motorista.driverProfile.id
    ) {
      return NextResponse.json(
        { error: "Veículo não vinculado a este motorista." },
        { status: 403 }
      );
    }

    // A transação serializável protege contra duas
    // confirmações simultâneas para o mesmo veículo.
    const resultado = await prisma.$transaction(
      async (tx) => {
        const entradaAberta = await tx.yardMovement.findFirst({
          where: {
            vehicleId: expedicao.vehicleId,
            exitAt: null,
          },
        });

        if (entradaAberta) {
          return { duplicada: true as const };
        }

        const movimentacao = await tx.yardMovement.create({
          data: {
            vehicleId: expedicao.vehicleId,
            yardId: expedicao.yardId,
            createdById: porteiro.id,
            status: "NO_PATIO",
            notes: `Entrada referente à expedição ${expedicao.id}`,
          },
        });

        return {
          duplicada: false as const,
          movimentacao,
        };
      },
      {
        isolationLevel: "Serializable",
      }
    );

    if (resultado.duplicada) {
      return NextResponse.json(
        {
          error:
            "Este veículo já possui uma entrada aberta no pátio.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Entrada registrada com sucesso!",
        movimentacao: {
          id: resultado.movimentacao.id,
          status: resultado.movimentacao.status,
          entryAt: resultado.movimentacao.entryAt,
        },
        motorista: motorista.name,
        plate: expedicao.vehicle.plate,
        yard: expedicao.yard.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao confirmar entrada:", error);

    // Conflito de transação concorrente.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          error:
            "Outra operação ocorreu simultaneamente. Atualize a leitura e tente novamente.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Não foi possível registrar a entrada." },
      { status: 500 }
    );
  }
}