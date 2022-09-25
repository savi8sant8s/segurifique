/*
  Warnings:

  - Added the required column `name` to the `TranslatedAlert` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TranslatedAlert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alert" TEXT NOT NULL,
    "alertRef" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_TranslatedAlert" ("alert", "alertRef", "createdAt", "description", "id", "solution") SELECT "alert", "alertRef", "createdAt", "description", "id", "solution" FROM "TranslatedAlert";
DROP TABLE "TranslatedAlert";
ALTER TABLE "new_TranslatedAlert" RENAME TO "TranslatedAlert";
CREATE UNIQUE INDEX "TranslatedAlert_alertRef_key" ON "TranslatedAlert"("alertRef");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
