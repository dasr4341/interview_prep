/*
  Warnings:

  - You are about to drop the column `status` on the `invoice_record` table. All the data in the column will be lost.
  - You are about to drop the `end_user_invoice_record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `end_user_payment_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "end_user_invoice_record" DROP CONSTRAINT "end_user_invoice_record_car_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice_record" DROP CONSTRAINT "invoice_record_quotation_id_fkey";

-- AlterTable
ALTER TABLE "invoice_record" DROP COLUMN "status",
ADD COLUMN     "bundle_id" TEXT,
ADD COLUMN     "car_id" UUID,
ADD COLUMN     "invoice_status" "RazorpayOrderStatus" NOT NULL DEFAULT 'CREATED',
ADD COLUMN     "products_purchased" TEXT[],
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "quotation_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment_logs" ADD COLUMN     "car_id" TEXT,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "quotation_id" DROP NOT NULL;

-- DropTable
DROP TABLE "end_user_invoice_record";

-- DropTable
DROP TABLE "end_user_payment_logs";

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_record" ADD CONSTRAINT "invoice_record_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
