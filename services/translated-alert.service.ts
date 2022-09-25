import { TranslatedAlert } from '@prisma/client';
import { prisma } from './prisma.service';

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