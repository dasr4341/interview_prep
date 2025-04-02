/*
  Warnings:

  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "registration";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "is_email_confirmed" BOOLEAN DEFAULT false,
    "is_phone_no_confirmed" BOOLEAN DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_number_key" ON "user"("phone_number");
