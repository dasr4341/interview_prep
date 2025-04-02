/*
  Warnings:

  - The values [PETROL,DIESEL,ELECTRIC,HYBRID] on the enum `FuelType` will be removed. If these variants are still used in the database, this will fail.
  - The values [AUTOMATIC,MANUAL] on the enum `TransmissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FuelType_new" AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid');
ALTER TABLE "car" ALTER COLUMN "fuel_type" TYPE "FuelType_new" USING ("fuel_type"::text::"FuelType_new");
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
ALTER TYPE "FuelType_new" RENAME TO "FuelType";
DROP TYPE "FuelType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransmissionType_new" AS ENUM ('AT', 'MT');
ALTER TABLE "car" ALTER COLUMN "transmission" TYPE "TransmissionType_new" USING ("transmission"::text::"TransmissionType_new");
ALTER TYPE "TransmissionType" RENAME TO "TransmissionType_old";
ALTER TYPE "TransmissionType_new" RENAME TO "TransmissionType";
DROP TYPE "TransmissionType_old";
COMMIT;
