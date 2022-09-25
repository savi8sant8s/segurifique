/*
  Warnings:

  - A unique constraint covering the columns `[alertRef]` on the table `TranslatedAlerts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TranslatedAlerts_alertRef_key" ON "TranslatedAlerts"("alertRef");
