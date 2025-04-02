/*
  Warnings:

  - Changed the type of `car_id` on the `products_purchased` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products_purchased" DROP COLUMN "car_id",
ADD COLUMN     "car_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "products_purchased" ADD CONSTRAINT "products_purchased_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
