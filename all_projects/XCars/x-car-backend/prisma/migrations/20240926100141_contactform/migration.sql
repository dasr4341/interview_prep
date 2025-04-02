-- CreateTable
CREATE TABLE "contact_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_details" JSONB NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "contact_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact_data" ADD CONSTRAINT "contact_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
