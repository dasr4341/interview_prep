/*
  Warnings:

  - The values [Petrol,Diesel,Electric,Hybrid] on the enum `FuelType` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `car` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FuelType_new" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');
ALTER TABLE "car" ALTER COLUMN "fuel_type" TYPE "FuelType_new" USING ("fuel_type"::text::"FuelType_new");
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
ALTER TYPE "FuelType_new" RENAME TO "FuelType";
DROP TYPE "FuelType_old";
COMMIT;

-- AlterTable
ALTER TABLE "car" DROP COLUMN "status",
ADD COLUMN     "status" "CarStatus" NOT NULL DEFAULT 'PENDING';
