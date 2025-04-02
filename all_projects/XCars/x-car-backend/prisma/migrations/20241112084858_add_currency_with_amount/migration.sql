-- AlterTable
ALTER TABLE "car_product" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "end_user_invoice_record" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "invoice_record" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';
