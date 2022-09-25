/*
  Warnings:

  - You are about to drop the `Alerts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Alerts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TranslatedAlerts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alert" TEXT NOT NULL,
    "alertRef" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT NOT NULL
);
