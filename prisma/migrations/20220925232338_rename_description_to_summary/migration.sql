/*
  Warnings:

  - You are about to drop the column `description` on the `TranslatedAlert` table. All the data in the column will be lost.
  - Added the required column `summary` to the `TranslatedAlert` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TranslatedAlert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "solution" TEXT NOT NULL
);
INSERT INTO "new_TranslatedAlert" ("alertId", "createdAt", "id", "solution", "title") SELECT "alertId", "createdAt", "id", "solution", "title" FROM "TranslatedAlert";
DROP TABLE "TranslatedAlert";
ALTER TABLE "new_TranslatedAlert" RENAME TO "TranslatedAlert";
CREATE UNIQUE INDEX "TranslatedAlert_alertId_key" ON "TranslatedAlert"("alertId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
