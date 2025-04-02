/*
  Warnings:

  - The `payment_flag` column on the `end_user_invoice_record` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `file_name` on the `user_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "end_user_invoice_record" DROP COLUMN "payment_flag",
ADD COLUMN     "payment_flag" "CarProductType"[];

-- AlterTable
ALTER TABLE "user_documents" DROP COLUMN "file_name",
ADD COLUMN     "file_name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DealerDocumentType";

-- DropEnum
DROP TYPE "PaymentType";
