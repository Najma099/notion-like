-- CreateTable
CREATE TABLE "Keystore" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "primaryKey" TEXT NOT NULL,
    "secondaryKey" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keystore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Keystore_clientId_idx" ON "Keystore"("clientId");

-- AddForeignKey
ALTER TABLE "Keystore" ADD CONSTRAINT "Keystore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
