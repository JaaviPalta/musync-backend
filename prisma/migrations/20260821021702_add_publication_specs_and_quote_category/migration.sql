-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "format" VARCHAR(160),
ADD COLUMN     "license" VARCHAR(160),
ADD COLUMN     "size_label" VARCHAR(60);

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "category" VARCHAR(120),
ADD COLUMN     "subcategory" VARCHAR(120);
