-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('artist', 'client');

-- AlterTable: agregar access_token como opcional primero, porque ya existen
-- filas en "quotes" y no hay forma de que la base rellene un cuid() sola.
ALTER TABLE "quotes" ADD COLUMN "access_token" TEXT;

-- Rellenar las filas existentes con un valor único generado en SQL, sin
-- depender de ninguna extensión (md5 y random son funciones nativas).
UPDATE "quotes"
SET "access_token" = md5(random()::text || clock_timestamp()::text || id::text)
WHERE "access_token" IS NULL;

-- Ahora sí, hacerla obligatoria y única.
ALTER TABLE "quotes" ALTER COLUMN "access_token" SET NOT NULL;
CREATE UNIQUE INDEX "quotes_access_token_key" ON "quotes"("access_token");

-- CreateTable
CREATE TABLE "quote_messages" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quote_messages_quote_id_idx" ON "quote_messages"("quote_id");

-- AddForeignKey
ALTER TABLE "quote_messages" ADD CONSTRAINT "quote_messages_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
