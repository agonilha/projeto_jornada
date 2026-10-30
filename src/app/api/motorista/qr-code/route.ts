import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.role !== "MOTORISTA"
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado." },
        { status: 401 }
      );
    }

    const secret = process.env.NEXTAUTH_SECRET;

    if (!secret) {
      throw new Error("NEXTAUTH_SECRET não configurado.");
    }

    const motorista = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
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
      !motorista.driverProfile
    ) {
      return NextResponse.json(
        { error: "Motorista não encontrado ou inativo." },
        { status: 404 }
      );
    }

    const expiraEm = Math.floor(Date.now() / 1000) + 300;

    const payload = Buffer.from(
      JSON.stringify({
        sub: motorista.id,
        exp: expiraEm,
      })
    ).toString("base64url");

    const assinatura = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const qrCode = `${payload}.${assinatura}`;

    const veiculo = motorista.driverProfile.vehicles[0];

    return NextResponse.json(
      {
        name: motorista.name,
        plate: veiculo?.plate ?? null,
        qrCode,
        expiresAt: new Date(expiraEm * 1000).toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);

    return NextResponse.json(
      { error: "Não foi possível gerar o QR Code." },
      { status: 500 }
    );
  }
}