/*
  Warnings:

  - You are about to drop the column `Description` on the `Address` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postalCode" TEXT NOT NULL,
    "houseNumber" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("createdAt", "houseNumber", "id", "postalCode", "userId") SELECT "createdAt", "houseNumber", "id", "postalCode", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
PRAGMA foreign_key_check("Address");
PRAGMA foreign_keys=ON;
