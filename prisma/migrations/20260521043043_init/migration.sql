-- CreateTable
CREATE TABLE "ParkingLog" (
    "id" SERIAL NOT NULL,
    "vehicle" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingLog_pkey" PRIMARY KEY ("id")
);
