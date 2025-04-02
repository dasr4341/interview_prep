/*
  Warnings:

  - You are about to drop the column `status` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `vimeo_video_id` on the `car_gallery_documents` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `car_product` table. All the data in the column will be lost.
  - You are about to drop the column `videoVimeoId` on the `car_product_documents` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `quotation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_documents` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - Added the required column `admin_status` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotation_status` to the `quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'ONBOARDED', 'DISABLED');

-- DropForeignKey
ALTER TABLE "user_documents" DROP CONSTRAINT "user_documents_userId_fkey";

-- AlterTable
ALTER TABLE "admin" DROP COLUMN "status",
ADD COLUMN     "admin_status" "UserStatus" NOT NULL;

-- AlterTable
ALTER TABLE "car" DROP COLUMN "status",
ADD COLUMN     "car_status" "CarStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "car_gallery_documents" DROP COLUMN "vimeo_video_id",
ADD COLUMN     "video_vimeo_id" TEXT;

-- AlterTable
ALTER TABLE "car_product" DROP COLUMN "productType",
ADD COLUMN     "product_type" "ProductType" NOT NULL DEFAULT 'PRODUCT';

-- AlterTable
ALTER TABLE "car_product_documents" DROP COLUMN "videoVimeoId",
ADD COLUMN     "video_vimeo_id" TEXT;

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "status",
ADD COLUMN     "lead_status" "LeadsStatus" NOT NULL DEFAULT 'UNASSIGNED';

-- AlterTable
ALTER TABLE "quotation" DROP COLUMN "status",
ADD COLUMN     "quotation_status" "QuotationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "user_documents" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "user_status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "Status";

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
