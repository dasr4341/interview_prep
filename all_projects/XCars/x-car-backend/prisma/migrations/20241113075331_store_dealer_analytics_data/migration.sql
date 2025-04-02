-- CreateTable
CREATE TABLE "dealer_analytics" (
    "id" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealer_analytics_pkey" PRIMARY KEY ("id")
);
