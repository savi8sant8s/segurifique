-- CreateTable
CREATE TABLE "Alerts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alert" TEXT NOT NULL,
    "alertRef" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT NOT NULL
);
