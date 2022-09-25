/*
  Warnings:

  - You are about to drop the `TranslatedAlerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhitelistUrls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TranslatedAlerts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WhitelistUrls";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TranslatedAlert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alert" TEXT NOT NULL,
    "alertRef" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TranslatedAlert_alertRef_key" ON "TranslatedAlert"("alertRef");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_url_key" ON "Whitelist"("url");
