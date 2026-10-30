import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !["PORTEIRO", "ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const qrCode = body?.qrCode;

    if (
      typeof qrCode !== "string" ||
      qrCode.length > 2048
    ) {
      return NextResponse.json(
        { error: "QR Code inválido." },
        { status: 400 }
      );
    }

    const partes = qrCode.split(".");

    if (partes.length !== 2) {
      return NextResponse.json(
        { error: "Formato de QR Code inválido." },
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

    const conteudo = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      typeof conteudo.sub !== "string" ||
      typeof conteudo.exp !== "number" ||
      !Number.isSafeInteger(conteudo.exp) ||
      conteudo.exp <= Math.floor(Date.now() / 1000)
    ) {
      return NextResponse.json(
        { error: "QR Code inválido ou expirado." },
        { status: 401 }
      );
    }

    const motorista = await prisma.user.findUnique({
      where: { id: conteudo.sub },
      include: {
        driverProfile: {
          include: {
            vehicles: true,
          },
        },
      },
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
        driverId: motorista.id,
        status: {
          notIn: ["FINALIZADA", "CANCELADA"],
        },
      },
      include: {
        yard: true,
        vehicle: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json(
      {
        motorista: {
          id: motorista.id,
          name: motorista.name,
        },
        veiculos: motorista.driverProfile.vehicles.map(
          (veiculo) => ({
            id: veiculo.id,
            plate: veiculo.plate,
          })
        ),
        expedicao: expedicao
          ? {
              id: expedicao.id,
              description: expedicao.description,
              status: expedicao.status,
              scheduledAt: expedicao.scheduledAt,
              yard: {
                id: expedicao.yard.id,
                name: expedicao.yard.name,
              },
              vehicle: {
                id: expedicao.vehicle.id,
                plate: expedicao.vehicle.plate,
              },
            }
          : null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao validar QR Code:", error);

    return NextResponse.json(
      { error: "Não foi possível validar o QR Code." },
      { status: 500 }
    );
  }
}