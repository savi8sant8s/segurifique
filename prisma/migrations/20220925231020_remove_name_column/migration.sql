/*
  Warnings:

  - You are about to drop the column `name` on the `TranslatedAlert` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TranslatedAlert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alert" TEXT NOT NULL,
    "alertRef" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT NOT NULL
);
INSERT INTO "new_TranslatedAlert" ("alert", "alertRef", "createdAt", "description", "id", "solution") SELECT "alert", "alertRef", "createdAt", "description", "id", "solution" FROM "TranslatedAlert";
DROP TABLE "TranslatedAlert";
ALTER TABLE "new_TranslatedAlert" RENAME TO "TranslatedAlert";
CREATE UNIQUE INDEX "TranslatedAlert_alertRef_key" ON "TranslatedAlert"("alertRef");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
