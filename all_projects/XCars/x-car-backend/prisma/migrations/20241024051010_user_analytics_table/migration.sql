-- CreateTable
CREATE TABLE "UserAnalytics" (
    "id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);
