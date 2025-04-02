-- AlterTable
ALTER TABLE "user_analytics" ADD COLUMN     "app" TEXT,
ADD COLUMN     "origin" TEXT,
ALTER COLUMN "ip_address" DROP NOT NULL,
ALTER COLUMN "user_agent" DROP NOT NULL,
ALTER COLUMN "referrer" DROP NOT NULL,
ALTER COLUMN "operation" DROP NOT NULL;
