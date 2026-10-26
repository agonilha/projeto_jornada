-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PEDIDO_RECEBIDO', 'EM_SEPARACAO', 'AGUARDANDO_CARREGAMENTO', 'EM_CARREGAMENTO', 'FINALIZADA', 'CANCELADA');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "yardId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PEDIDO_RECEBIDO',
    "loadingProgress" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shipment_driverId_status_idx" ON "Shipment"("driverId", "status");

-- CreateIndex
CREATE INDEX "Shipment_yardId_status_idx" ON "Shipment"("yardId", "status");

-- CreateIndex
CREATE INDEX "Shipment_scheduledAt_idx" ON "Shipment"("scheduledAt");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
