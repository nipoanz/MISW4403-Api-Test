/*
  Warnings:

  - You are about to drop the `Airline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryCoverage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CountryCoverage" DROP CONSTRAINT "CountryCoverage_airlineId_fkey";

-- DropTable
DROP TABLE "Airline";

-- DropTable
DROP TABLE "CountryCoverage";

-- CreateTable
CREATE TABLE "airlines" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foundingDate" TIMESTAMP(3) NOT NULL,
    "website" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airline_airport" (
    "airlineId" UUID NOT NULL,
    "airportId" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airline_airport_pkey" PRIMARY KEY ("airlineId","airportId")
);

-- CreateIndex
CREATE UNIQUE INDEX "airlines_name_key" ON "airlines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");

-- AddForeignKey
ALTER TABLE "airline_airport" ADD CONSTRAINT "airline_airport_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airline_airport" ADD CONSTRAINT "airline_airport_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "airports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
