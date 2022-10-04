import alerts from '@/alerts-br.json'

export async function getTranslatedAlert(alertRef: string) {
  return alerts.find(alert => alert.alertRef === alertRef)
}
