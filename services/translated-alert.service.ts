import alerts from '@/helpers/alerts-br.json'

export async function getTranslatedAlert(alertRef: string) {
  return alerts.find(alert => alert.alertRef === alertRef)
}
