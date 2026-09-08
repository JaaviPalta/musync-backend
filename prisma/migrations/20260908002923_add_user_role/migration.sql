-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('artist', 'client');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'artist';
