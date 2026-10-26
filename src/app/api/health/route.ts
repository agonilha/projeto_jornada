// app/api/health/route.ts
import prisma from "@/lib/prisma"; // ajuste para o seu módulo

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DATABASE_URL não definida" }, { status: 500 });
  }

  try {
    const rows = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("Falha ao consultar o banco:", error);
    return Response.json({ error: "Falha ao consultar o banco" }, { status: 500 });
  }
}