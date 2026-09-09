-- AlterTable
ALTER TABLE "artist_profiles" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
