-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('music', 'digital_product', 'service', 'portfolio');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "QuoteRequestType" AS ENUM ('quote', 'booking');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "artist_name" VARCHAR(120) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "bio" TEXT,
    "specialty" VARCHAR(120),
    "city" VARCHAR(120),
    "country" VARCHAR(120),
    "avatar_url" TEXT,
    "cover_url" TEXT,
    "spotify_url" TEXT,
    "youtube_url" TEXT,
    "instagram_url" TEXT,
    "tiktok_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" SERIAL NOT NULL,
    "artist_profile_id" INTEGER NOT NULL,
    "type" "PublicationType" NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "image_url" TEXT,
    "external_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" SERIAL NOT NULL,
    "artist_profile_id" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "venue" VARCHAR(160),
    "city" VARCHAR(120),
    "show_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" SERIAL NOT NULL,
    "artist_profile_id" INTEGER NOT NULL,
    "publication_id" INTEGER,
    "request_type" "QuoteRequestType" NOT NULL DEFAULT 'quote',
    "client_name" VARCHAR(120) NOT NULL,
    "client_email" VARCHAR(255) NOT NULL,
    "budget" INTEGER,
    "event_date" DATE,
    "message" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "artist_profile_id" INTEGER NOT NULL,
    "buyer_name" VARCHAR(120) NOT NULL,
    "buyer_email" VARCHAR(255) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'created',
    "total" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "line_total" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artist_profiles_user_id_key" ON "artist_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "artist_profiles_username_key" ON "artist_profiles"("username");

-- CreateIndex
CREATE INDEX "artist_profiles_username_idx" ON "artist_profiles"("username");

-- CreateIndex
CREATE INDEX "publications_artist_profile_id_idx" ON "publications"("artist_profile_id");

-- CreateIndex
CREATE INDEX "publications_type_is_active_idx" ON "publications"("type", "is_active");

-- CreateIndex
CREATE INDEX "shows_artist_profile_id_idx" ON "shows"("artist_profile_id");

-- CreateIndex
CREATE INDEX "shows_show_date_idx" ON "shows"("show_date");

-- CreateIndex
CREATE INDEX "quotes_artist_profile_id_idx" ON "quotes"("artist_profile_id");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "orders_artist_profile_id_idx" ON "orders"("artist_profile_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- AddForeignKey
ALTER TABLE "artist_profiles" ADD CONSTRAINT "artist_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_artist_profile_id_fkey" FOREIGN KEY ("artist_profile_id") REFERENCES "artist_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_artist_profile_id_fkey" FOREIGN KEY ("artist_profile_id") REFERENCES "artist_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_artist_profile_id_fkey" FOREIGN KEY ("artist_profile_id") REFERENCES "artist_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_artist_profile_id_fkey" FOREIGN KEY ("artist_profile_id") REFERENCES "artist_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
