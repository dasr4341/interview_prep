-- AddForeignKey
ALTER TABLE "car_document_free_tier" ADD CONSTRAINT "car_document_free_tier_car_document_id_fkey" FOREIGN KEY ("car_document_id") REFERENCES "car_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_document_free_tier" ADD CONSTRAINT "car_document_free_tier_car_video_id_fkey" FOREIGN KEY ("car_video_id") REFERENCES "car_video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
