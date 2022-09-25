import { createHandler, Get, Query } from 'next-api-decorators'
import {
  urlAlerts,
  createTranslatedAlert,
  getTranslatedAlertByAlertRef,
  translate,
} from '../../../services'

class AlertsHandler {
  @Get()
  async urlAlerts(@Query('url') url: string) {
    const { alerts } = await urlAlerts(url)
    for (let i = 0; i < alerts.length; i++) {
      let translatedAlert: any = await getTranslatedAlertByAlertRef(
        alerts[i].alertRef
      )
      if (!translatedAlert) {
        translatedAlert = {
          alertRef: alerts[i].alertRef,
          alert: await translate(alerts[i].alert),
          name: await translate(alerts[i].name),
          description: await translate(alerts[i].description),
          solution: await translate(alerts[i].solution),
        }
        await createTranslatedAlert(translatedAlert)
      }
      alerts[i].alert = translatedAlert.alert
      alerts[i].name = translatedAlert.name
      alerts[i].description = translatedAlert.description
      alerts[i].solution = translatedAlert.solution
    }
    return alerts
  }
}

export default createHandler(AlertsHandler)
