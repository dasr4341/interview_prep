/*
  Warnings:

  - The values [PETROL,DIESEL,ELECTRIC,HYBRID] on the enum `FuelType` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `car` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FuelType_new" AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid');
ALTER TABLE "car" ALTER COLUMN "fuel_type" TYPE "FuelType_new" USING ("fuel_type"::text::"FuelType_new");
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
ALTER TYPE "FuelType_new" RENAME TO "FuelType";
DROP TYPE "FuelType_old";
COMMIT;

-- AlterTable
ALTER TABLE "car" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
