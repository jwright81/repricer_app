-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "Strategy" AS ENUM ('MATCH_LOWEST', 'BEAT_BY_AMOUNT', 'BEAT_BY_PERCENT', 'STAY_ABOVE');
CREATE TYPE "CompetitorStatus" AS ENUM ('CANDIDATE', 'APPROVED', 'DENIED');

-- CreateTable User
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CreateTable Store
CREATE TABLE "Store" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "ebayUserName" TEXT NOT NULL,
  "ebayStoreId" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT NOT NULL,
  "tokenExpiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable Product
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sku" TEXT,
  "itemPrice" DOUBLE PRECISION NOT NULL,
  "shippingPrice" DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "itemCost" DOUBLE PRECISION,
  "shippingLabelCost" DOUBLE PRECISION,
  "ebayFinalValueFeePct" DOUBLE PRECISION,
  "roiMinPct" DOUBLE PRECISION,
  "roiMinDollar" DOUBLE PRECISION,
  "minPrice" DOUBLE PRECISION,
  "maxPrice" DOUBLE PRECISION,
  "strategy" "Strategy" NOT NULL DEFAULT 'MATCH_LOWEST',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Product_listingId_key" ON "Product"("listingId");

-- CreateTable Competitor
CREATE TABLE "Competitor" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "seller" TEXT NOT NULL,
  "itemPrice" DOUBLE PRECISION NOT NULL,
  "shippingPrice" DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "condition" TEXT,
  "feedbackScore" INTEGER,
  "shippingSpeed" TEXT,
  "status" "CompetitorStatus" NOT NULL DEFAULT 'CANDIDATE',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Competitor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Competitor_productId_listingId_key" UNIQUE ("productId", "listingId")
);

-- CreateTable ActivityLog
CREATE TABLE "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
