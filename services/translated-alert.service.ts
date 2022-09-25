import { PrismaClient, TranslatedAlert } from "@prisma/client"

const prisma = new PrismaClient()

export async function createTranslatedAlert(alert: TranslatedAlert) {
  return await prisma.translatedAlert.create({
    data: alert,
  });
}

export async function getTranslatedAlertByAlertRef(alertRef: string) {
  return await prisma.translatedAlert.findUnique({
    where: {
      alertRef,
    },
  });
}