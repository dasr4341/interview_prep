-- DropForeignKey
ALTER TABLE "bundle_items" DROP CONSTRAINT "bundle_items_bundle_id_fkey";

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "product_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
