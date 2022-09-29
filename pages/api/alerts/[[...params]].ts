import { createHandler, Get, Query } from 'next-api-decorators'
import {
  getTranslatedAlert,
  urlAlerts,
} from '../../../services'

class AlertsHandler {
  @Get()
  async urlAlerts(@Query('url') url: string) {
    const { alerts } = await urlAlerts(url)
    for (let i = 0; i < alerts.length; i++) {
      const translatedAlert = await getTranslatedAlert(
        alerts[i].alertRef
      )
      if (translatedAlert) {
        alerts[i].alert = translatedAlert.alert
        alerts[i].description = translatedAlert.description
        alerts[i].solution = translatedAlert.solution
      }
    }
    return alerts
  }
}

export default createHandler(AlertsHandler)
