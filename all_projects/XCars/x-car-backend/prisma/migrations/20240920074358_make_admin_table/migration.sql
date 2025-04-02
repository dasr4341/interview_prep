-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
