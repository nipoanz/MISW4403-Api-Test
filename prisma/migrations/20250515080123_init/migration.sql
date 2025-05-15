-- CreateTable
CREATE TABLE "Airline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iataCode" TEXT NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryCoverage" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "airlineId" INTEGER NOT NULL,

    CONSTRAINT "CountryCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iataCode_key" ON "Airline"("iataCode");

-- AddForeignKey
ALTER TABLE "CountryCoverage" ADD CONSTRAINT "CountryCoverage_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
