import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createTranslatedAlert(alert) {
  return await prisma.translatedAlerts.create({
    data: alert,
  });
}

export async function getTranslatedAlertByAlertRef(alertRef) {
  return await prisma.translatedAlerts.findUnique({
    where: {
      alertRef,
    },
  });
}