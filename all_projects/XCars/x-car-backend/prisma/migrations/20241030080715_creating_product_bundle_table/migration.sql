-- CreateTable
CREATE TABLE "product_bundles" (
    "id" TEXT NOT NULL,
    "car_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_flags" "CarProductType"[],

    CONSTRAINT "product_bundles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_bundles" ADD CONSTRAINT "product_bundles_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
