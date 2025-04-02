-- CreateTable
CREATE TABLE "Registration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "opt" INTEGER NOT NULL,
    "isOtpVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneNo" INTEGER NOT NULL,
    "is_email_confirmed" BOOLEAN DEFAULT false,
    "is_phone_no_confirmed" BOOLEAN DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_key" ON "Registration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_phoneNo_key" ON "Registration"("phoneNo");
