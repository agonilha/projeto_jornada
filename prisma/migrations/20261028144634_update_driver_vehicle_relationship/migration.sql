/*
  Warnings:

  - You are about to drop the column `vehicleId` on the `DriverProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `DriverProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_vehicleId_fkey";

-- DropIndex
DROP INDEX "DriverProfile_vehicleId_key";

-- AlterTable
ALTER TABLE "DriverProfile" DROP COLUMN "vehicleId",
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "driverProfileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_cpf_key" ON "DriverProfile"("cpf");

-- CreateIndex
CREATE INDEX "Vehicle_driverProfileId_idx" ON "Vehicle"("driverProfileId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
