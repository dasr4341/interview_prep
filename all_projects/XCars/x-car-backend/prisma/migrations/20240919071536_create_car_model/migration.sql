-- CreateTable
CREATE TABLE "Car" (
    "id" UUID NOT NULL,
    "launchYear" INTEGER NOT NULL,
    "totalRun" INTEGER NOT NULL,
    "noOfOwners" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
