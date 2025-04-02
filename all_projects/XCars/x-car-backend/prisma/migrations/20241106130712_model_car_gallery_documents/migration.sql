-- CreateTable
CREATE TABLE "car_gallery_documents" (
    "id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "car_gallery_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_gallery_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car_gallery_documents" ADD CONSTRAINT "car_gallery_documents_car_gallery_id_fkey" FOREIGN KEY ("car_gallery_id") REFERENCES "car_gallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
